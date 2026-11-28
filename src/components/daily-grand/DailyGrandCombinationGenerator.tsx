"use client";
import {useEffect,useState} from "react";
import packed from "../../data/daily-grand-draws.json";
import {generateDailyGrandTickets,validateDailyGrandDraws} from "../../lib/daily-grand/generator";
import {DATASET_VERSION,DEFAULT_BALANCED_PARAMETERS,type BalancedParameters,type DailyGrandDraw,type GeneratedTicket,type SelectionStrategy} from "../../lib/daily-grand/types";
const STORAGE="lotterylab.daily-grand.generated.v1";
const binary=atob(packed as string);
if(binary.length%6!==0) throw new Error("Daily Grand dataset has an invalid encoded length.");
const draws:DailyGrandDraw[]=[];
for(let offset=0;offset<binary.length;offset+=6){
 let bit=0;
 const readBits=(width:number)=>{let result=0;for(let i=0;i<width;i++){const byte=binary.charCodeAt(offset+Math.floor(bit/8));const shift=7-(bit%8);result=(result<<1)|((byte>>shift)&1);bit++;}return result;};
 const dayOffset=readBits(12);
 const mainNumbers=Array.from({length:5},()=>readBits(6));
 // The packed 48-bit record reserves three padding bits before the Grand Number.
 bit+=3;
 const grandNumber=readBits(3);
 draws.push({drawDate:new Date(Date.UTC(2016,9,20+dayOffset)).toISOString().slice(0,10),mainNumbers,grandNumber});
}
const methods:{id:SelectionStrategy;title:string;description:string}[]=[
 {id:"random",title:"Random",description:"Uniform selection. Recommended default."},
 {id:"balanced",title:"Balanced",description:"Random selection filtered by your chosen patterns."},
 {id:"experimental",title:"Experimental",description:"Weighted by long-term frequency, recent frequency and gaps."}
];
function exportCsv(tickets:GeneratedTicket[]){const head=["generatedAt","strategy","mainNumbers","grandNumber","datasetVersion"];const rows=tickets.map(t=>[t.generatedAt,t.strategy,t.mainNumbers.join(" "),t.grandNumber,t.datasetVersion]);const csv=[head,...rows].map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="lotterylab-daily-grand-tickets.csv";a.click();URL.revokeObjectURL(url);}
export default function DailyGrandCombinationGenerator(){
 const [strategy,setStrategy]=useState<SelectionStrategy>("random"),[count,setCount]=useState(5),[params,setParams]=useState<BalancedParameters>(DEFAULT_BALANCED_PARAMETERS),[generated,setGenerated]=useState<GeneratedTicket[]>([]),[saved,setSaved]=useState<GeneratedTicket[]>([]),[error,setError]=useState("");
 useEffect(()=>{validateDailyGrandDraws(draws);try{const v=localStorage.getItem(STORAGE);if(v)setSaved(JSON.parse(v) as GeneratedTicket[]);}catch{setSaved([]);}},[]);
 function update<K extends keyof BalancedParameters>(key:K,value:number){setParams(p=>({...p,[key]:value}));}
 function generate(){setError("");try{if(params.minOdd>params.maxOdd||params.minLow>params.maxLow||params.minSum>params.maxSum)throw Error("Each minimum must be less than or equal to its maximum.");const next=generateDailyGrandTickets(draws,strategy,count,params),history=[...next,...saved].slice(0,500);localStorage.setItem(STORAGE,JSON.stringify(history));setGenerated(next);setSaved(history);}catch(e){setError(e instanceof Error?e.message:"Unable to generate tickets.");}}
 function clear(){localStorage.removeItem(STORAGE);setSaved([]);}
 return <div className="dg-workspace">
  <header className="dg-intro"><div className="eyebrow">LOTTERYLAB · PHASE 2 PREVIEW</div><h1>Daily Grand <span>Generator</span></h1><p>Generate and record combinations using five main numbers from 1–49 and one Grand Number from 1–7.</p><div className="dg-dataset-note"><span className="status-dot"/> {draws.length.toLocaleString()} historical draws · {draws[0].drawDate} to {draws[draws.length-1].drawDate}</div></header>
  <section className="dg-panel"><div className="eyebrow">01 · SELECTION</div><h2>Choose a method</h2><p className="dg-subcopy">Random is the default. Other methods are experimental, not predictive.</p>
   <div className="dg-strategies">{methods.map(m=><button key={m.id} type="button" aria-pressed={strategy===m.id} onClick={()=>setStrategy(m.id)} className={strategy===m.id?"dg-strategy dg-strategy-active":"dg-strategy"}><b>{m.title}</b><span>{m.description}</span></button>)}</div>
   {strategy==="balanced"&&<div className="dg-options"><h3>Balanced selection rules</h3><p>Tickets are randomly selected, then filtered against these limits.</p><div className="dg-fields">{([["minOdd","Minimum odd",0,5],["maxOdd","Maximum odd",0,5],["minLow","Minimum low (1–24)",0,5],["maxLow","Maximum low (1–24)",0,5],["minSum","Minimum sum",15,235],["maxSum","Maximum sum",15,235]] as const).map(([key,label,min,max])=><label className="dg-field" key={key}><span>{label}</span><input type="number" min={min} max={max} value={params[key]} onChange={e=>update(key,Number(e.target.value))}/></label>)}</div></div>}
   {strategy==="experimental"&&<div className="dg-warning">50% long-term frequency, 35% last-100-draw frequency and 15% current gap score. Historical backtesting did not demonstrate an advantage over random selection.</div>}
   <div className="dg-actions"><label className="dg-field dg-count"><span>Number of tickets</span><select value={count} onChange={e=>setCount(Number(e.target.value))}>{[1,3,5,10].map(n=><option key={n} value={n}>{n} tickets</option>)}</select></label><button className="dg-primary-button" type="button" onClick={generate}>Generate combinations ↗</button></div>{error&&<p role="alert" className="dg-error">{error}</p>}
  </section>
  {generated.length>0&&<section className="dg-results"><div className="eyebrow">02 · YOUR PICKS</div><h2>Generated combinations</h2><div className="dg-ticket-grid">{generated.map((t,i)=><article className="dg-ticket" key={t.id}><div className="dg-ticket-top"><span>Ticket {i+1}</span><span className="dg-tag">{t.strategy}</span></div><div className="dg-balls">{t.mainNumbers.map(n=><span className="dg-ball" key={n}>{n}</span>)}<span className="dg-plus">+</span><span className="dg-ball dg-grand">{t.grandNumber}</span></div><small>Generated {new Date(t.generatedAt).toLocaleString()}</small></article>)}</div></section>}
  <section className="dg-panel"><div className="dg-history-head"><div><div className="eyebrow">03 · LOCAL RECORD</div><h2>Generation history</h2><p className="dg-subcopy">Stored in this browser only · Maximum 500 tickets</p></div><div className="dg-history-actions"><button className="dg-secondary-button" disabled={!saved.length} onClick={()=>exportCsv(saved)}>Export CSV</button><button className="dg-secondary-button" disabled={!saved.length} onClick={clear}>Clear</button></div></div>
   {!saved.length?<p className="dg-empty">Generated tickets will appear here after your first generation.</p>:<div className="dg-table-wrap"><table className="dg-table"><thead><tr><th>Generated</th><th>Method</th><th>Main numbers</th><th>Grand</th><th>Dataset</th></tr></thead><tbody>{saved.slice(0,20).map(t=><tr key={t.id}><td>{new Date(t.generatedAt).toLocaleDateString()}</td><td>{t.strategy}</td><td>{t.mainNumbers.join(", ")}</td><td>{t.grandNumber}</td><td>{t.datasetVersion.slice(-10)}</td></tr>)}</tbody></table></div>}
  </section><footer className="dg-foot"><p>Dataset version: {DATASET_VERSION}.</p><p>Every valid combination has the same probability in a fair draw. Historical patterns and balanced constraints do not increase the odds of winning.</p></footer>
 </div>;
}
