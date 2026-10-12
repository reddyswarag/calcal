import type {Food,Macros} from './data';

// Nutrition transcribed from the user's product-label screenshots (October 2026).
// Quantities below are LABEL SERVINGS, not the user's intended daily amounts.
// Rounded US nutrition labels are not laboratory-exact values.
type Preset = {name:string;quantity:number;unit:Food['unit'];basis:Food['basis'];macros:Macros;source:string};
const label=(name:string,quantity:number,unit:Food['unit'],kcal:number,protein:number,carbs:number,fat:number,basis:Food['basis']='label'):Preset=>({name,quantity,unit,basis,macros:{kcal,protein,carbs,fat},source:'Nutrition label supplied by user; values rounded per serving'});
export const PRODUCT_PRESETS:Preset[]=[
 label('Body Fortress Chocolate Whey Protein',45,'g',180,30,7,4),
 label('Great Value Plain Nonfat Greek Yogurt',170,'g',100,17,7,0),
 label('Azumaya Firm Tofu',85,'g',70,7,2,4),
 label('Marketside Broccoli Florets',85,'g',30,2,6,0),
 label('Equate One Daily Men’s Multivitamin',1,'piece',0,0,0,0),
 label('Great Value Dry Pinto Beans',35,'g',100,8,22,0,'raw'),
 label('Great Value Creamy Peanut Butter',32,'g',180,7,8,15),
 label('Great Value Frozen Mixed Vegetables',85,'g',50,2,11,0),
 label('Great Value Minced Garlic in Water',5,'g',5,0,1,0),
 label('Great Value Long Grain White Rice (dry)',45,'g',160,3,36,0,'raw'),
 label('Six Star Whey Protein Vanilla Salted Caramel',41,'g',150,30,3,2),
 label('Great Value Honey',21,'g',60,0,17,0),
 label('Spring Valley Omega-3 Fish Oil Softgel',1,'piece',10,0,0,1),
 label('Great Value Large White Egg',1,'piece',70,6,0,5),
 label('Great Value Whole Vitamin D Milk',240,'ml',150,8,12,8),
 label('Freshness Guaranteed Chicken Breast (raw)',112,'g',140,25,0,4,'raw'),
];
export function presetFood(p:Preset):Food{return {id:'preset-'+p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name:p.name,quantity:p.quantity,unit:p.unit,basis:p.basis,perUnit:{kcal:p.macros.kcal/p.quantity,protein:p.macros.protein/p.quantity,carbs:p.macros.carbs/p.quantity,fat:p.macros.fat/p.quantity},source:p.source}}
