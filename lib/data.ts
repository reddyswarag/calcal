export type Macros={kcal:number; protein:number; carbs:number; fat:number};
export type Food={id:string;name:string; quantity:number; unit:'g'|'ml'|'piece'|'scoop'; basis:'raw'|'cooked'|'label'|'estimate';perUnit:Macros;source?:string};
export type Log={id:string;date:string;foodName:string;quantity:number;unit:string;macros:Macros;source:'chat'|'checklist';checklistId?:string;estimated?:boolean};
export type Measurement={id:string;date:string;weight?:number;bodyFat?:number;muscle?:number;water?:number;visceral?:number;bmi?:number;bmr?:number;bone?:number;metabolicAge?:number;notes?:string};
export type Store={targets:Macros;foods:Food[];logs:Log[];measurements:Measurement[];messages:{id:string;who:'user'|'assistant';text:string}[]};
export const ZERO:Macros={kcal:0,protein:0,carbs:0,fat:0};
export const START:Store={targets:{kcal:2000,protein:160,carbs:200,fat:60},foods:[],logs:[],measurements:[],messages:[]};
export const add=(a:Macros,b:Macros):Macros=>({kcal:a.kcal+b.kcal,protein:a.protein+b.protein,carbs:a.carbs+b.carbs,fat:a.fat+b.fat});
export const sub=(a:Macros,b:Macros):Macros=>({kcal:a.kcal-b.kcal,protein:a.protein-b.protein,carbs:a.carbs-b.carbs,fat:a.fat-b.fat});
export const scale=(a:Macros,f:number):Macros=>({kcal:a.kcal*f,protein:a.protein*f,carbs:a.carbs*f,fat:a.fat*f});
export const nutrients=(food:Food,quantity=food.quantity)=>scale(food.perUnit,quantity);
export const num=(n:number)=>Number.isFinite(n)?Math.round(n*10)/10:0;
export const id=()=>globalThis.crypto?.randomUUID?.()||String(Date.now()+Math.random());
export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function goodMacro(x:unknown):x is Macros { if(!x||typeof x!=='object')return false;return ['kcal','protein','carbs','fat'].every(k=>typeof (x as Record<string,unknown>)[k]==='number'&&Number.isFinite((x as Record<string,number>)[k])&&(x as Record<string,number>)[k]>=0)}
export function load():Store {try{const s=localStorage.getItem('calcal-v1');if(!s)return START;const parsed=JSON.parse(s);if(!parsed||!goodMacro(parsed.targets))return START;return {...START,...parsed,foods:Array.isArray(parsed.foods)?parsed.foods:[],logs:Array.isArray(parsed.logs)?parsed.logs:[],measurements:Array.isArray(parsed.measurements)?parsed.measurements:[],messages:Array.isArray(parsed.messages)?parsed.messages:[]}}catch{return START}}
export function safeNumber(value:unknown){const n=Number(value);return Number.isFinite(n)&&n>=0?n:0}
