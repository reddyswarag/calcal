import {NextRequest,NextResponse} from 'next/server';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 const key=process.env.OPENAI_API_KEY;
 if(!key)return NextResponse.json({error:'Add OPENAI_API_KEY to .env.local to enable photo and AI food analysis.'},{status:503});
 try{
  const body=await req.json();
  if(!['food','measurement'].includes(body.kind))return NextResponse.json({error:'Invalid request'},{status:400});
  const text=String(body.text||'').slice(0,1400);
  const image=typeof body.image==='string'&&/^data:image\/(jpeg|png|webp);base64,/.test(body.image)&&body.image.length<9_000_000?body.image:null;
  if(!text&&!image)return NextResponse.json({error:'Provide food text or an image.'},{status:400});
  const prompt=body.kind==='measurement'?`Extract only measurements clearly visible in the user's Dr Trust screenshot. Do NOT invent unseen values. Return exactly JSON object {"date": "YYYY-MM-DD or empty", "weight": number|null,"bodyFat": number|null,"muscle": number|null,"water": number|null,"visceral": number|null,"bmi": number|null,"bmr": number|null,"bone": number|null,"metabolicAge": number|null,"notes":string}. Use kg for masses and percent for percentages. Important: if the scale reports muscle percent rather than kilograms, leave muscle null and explain in notes. Use null when uncertain.`:`Understand the user's food or nutrition-label input for a personal macro tracker. Return JSON exactly {"name":string,"quantity":number,"unit":"g"|"ml"|"piece"|"scoop","basis":"raw"|"cooked"|"label"|"estimate","kcal":number,"protein":number,"carbs":number,"fat":number,"estimated":boolean,"clarification":string,"note":string}. The four macro numbers must refer to THE ENTIRE QUANTITY, not per 100g. Prefer visible nutrition label and serving size. If information is unclear or ingredients/portion size unknown, return a rough estimate with estimated=true and a short clarification. Never claim precision for visual estimates. If the quantity is not specified assume one serving, note this. Never make up nutrition labels. If user asks a general question rather than specifies foods, use clarification.`;
  const content:any[]=[{type:'text',text:prompt+'\nUser input: '+text}];if(image)content.push({type:'image_url',image_url:{url:image,detail:'high'}});
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',messages:[{role:'user',content}],temperature:0.1,response_format:{type:'json_object'},max_tokens:650}),signal:AbortSignal.timeout(30000)});
  const payload=await response.json();if(!response.ok)return NextResponse.json({error:payload.error?.message||'AI request failed'},{status:502});
  const parsed=JSON.parse(payload.choices?.[0]?.message?.content||'{}');return NextResponse.json(parsed);
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not analyze input'},{status:500})}
}
