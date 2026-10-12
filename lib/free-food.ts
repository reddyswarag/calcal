import {Food,Macros,nutrients,num} from './data';

export type FreeFoodResult = {ok:true; name:string;quantity:number;unit:string;macros:Macros;estimated:boolean;note:string}|{ok:false;message:string};

// Food values here are only fallbacks. Saved user labels/measurements take priority.
const basics:Food[]=[
  {id:'builtin-egg',name:'egg',quantity:1,unit:'piece',basis:'estimate',perUnit:{kcal:72,protein:6.3,carbs:0.4,fat:4.8},source:'generic estimate'},
  {id:'builtin-banana',name:'banana',quantity:1,unit:'piece',basis:'estimate',perUnit:{kcal:105,protein:1.3,carbs:27,fat:0.4},source:'generic estimate'},
];
const singular=(v:string)=>v.toLowerCase().trim().replace(/\s+/g,' ').replace(/\beggs\b/g,'egg').replace(/\bbananas\b/g,'banana').replace(/\bscoops\b/g,'scoop').replace(/\bpieces\b/g,'piece');
const unitName=(u:string)=>({grams:'g',gram:'g',g:'g',milliliters:'ml',milliliter:'ml',ml:'ml',piece:'piece',scoop:'scoop'} as Record<string,string>)[u.toLowerCase()]||u.toLowerCase();
export function freeFood(text:string,saved:Food[]):FreeFoodResult{
  const input=singular(text).replace(/^(i ate|i have|i want|thinking of eating|had)\s+/,'').trim();
  // Accept "2 eggs", "150g rice", "200 ml milk", "egg 2", and saved-food names with quantities.
  const first=input.match(/^(\d+(?:\.\d+)?)\s*(g|grams?|ml|milliliters?|pieces?|scoops?)?\s+(.+)$/);
  const joined=input.match(/^(\d+(?:\.\d+)?)(g|ml)\s+(.+)$/);
  const last=input.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(g|grams?|ml|milliliters?|pieces?|scoops?)?$/);
  const match=first||joined||last;
  if(!match)return {ok:false,message:'Enter a quantity and food, such as “2 eggs” or “150g rice”. For exact packaged-food macros, save the food in Checklist first.'};
  const atEnd=match===last;
  const qty=Number(atEnd?match[2]:match[1]);
  const explicitUnit=atEnd?match[3]:match[2];
  const name=singular(atEnd?match[1]:match[3]);
  if(!Number.isFinite(qty)||qty<=0||qty>100000)return {ok:false,message:'Enter a valid positive quantity.'};
  const candidates=[...saved,...basics];
  // Prefer the user's saved foods; avoid a partial-name guess if multiple foods match.
  const exact=candidates.filter(f=>singular(f.name)===name);
  const partial=exact.length?exact:candidates.filter(f=>singular(f.name).includes(name)||name.includes(singular(f.name)));
  if(!partial.length)return {ok:false,message:`I don't have verified nutrition data for “${name}”. Add it in Checklist with the macros from its label first, then try again.`};
  const found=partial[0];
  if(partial.length>1&&!exact.length)return {ok:false,message:`More than one saved food matches “${name}”. Enter its full saved name to avoid the wrong nutrition values.`};
  const unit=explicitUnit?unitName(explicitUnit):found.unit;
  if(unit!==found.unit)return {ok:false,message:`“${found.name}” is saved in ${found.unit}. Please enter a quantity in ${found.unit}, or save a separate nutrition entry with the correct units.`};
  const m=nutrients(found,qty);
  return {ok:true,name:found.name,quantity:qty,unit,macros:{kcal:num(m.kcal),protein:num(m.protein),carbs:num(m.carbs),fat:num(m.fat)},estimated:found.basis==='estimate',note:found.source==='generic estimate'?'Generic food estimate — verify serving size and ingredients.':'Calculated from your saved food entry.'};
}
