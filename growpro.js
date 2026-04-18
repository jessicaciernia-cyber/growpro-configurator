const WEBHOOK_URL="YOUR_GHL_WEBHOOK_URL_HERE";
let CS=1,SP=null,ST=[],SA=[];
const PP={template:8500,custom:25000},TP=500;
const TN={mens_health:"Men's Health",womens_hormones:"Women's Hormones",hair_loss:"Hair Loss",skin_care:"Skin Care",sleep:"Sleep",anti_aging:"Anti-Aging",weight_loss_supplements:"Weight Loss Supplements"};
const AN={fast_track_priority:"Fast Track Priority (4-6 weeks)",fast_track_standard:"Fast Track Standard (8 weeks)",peptide_package:"Reclassifying Peptide Package",branded_medication:"Branded Medication Pathway",elective_labs:"Elective Labs + HRT Program",meta_ads:"Meta Ads Management",google_ads:"Google Ads Management",email_ghl:"Email + GHL Automation + All Flows",social_support:"Advanced Social + Customer Support",seo_blog:"SEO Blog Writing 30 posts/mo",quiz_single:"Single Lifestyle Quiz",quiz_dual:"Dual Quiz Bundle",quiz_triple:"Triple Quiz Bundle",post_launch_support:"Post-Launch Support Package",welliemd_support:"WellieMD Tech Support",web_support:"Web Support",ghl_support:"GHL Support",premium_support_all:"Premium Tech Support All 3"};
function selectPackage(p){SP=p;document.querySelectorAll('#step1 .gp-c').forEach(c=>c.classList.remove('sel'));document.querySelector('[data-package="'+p+'"]').classList.add('sel');document.getElementById('step1Next').disabled=false;updatePricing()}
function toggleTreatment(c){const t=c.dataset.treatment;if(c.classList.contains('sel')){c.classList.remove('sel');ST=ST.filter(x=>x!==t)}else{c.classList.add('sel');ST.push(t)}updatePricing()}
function toggleAddon(c){const a=c.dataset.addon,g=c.dataset.group;if(c.classList.contains('sel')){c.classList.remove('sel');SA=SA.filter(x=>x!==a);updatePricing();return}
if(g==='fasttrack'){document.querySelectorAll('[data-group="fasttrack"]').forEach(x=>{x.classList.remove('sel');SA=SA.filter(y=>y!==x.dataset.addon)})}
if(g==='quiz'){document.querySelectorAll('[data-group="quiz"]').forEach(x=>{x.classList.remove('sel');SA=SA.filter(y=>y!==x.dataset.addon)})}
if(g==='support'){const pc=document.querySelector('[data-addon="premium_support_all"]');if(pc&&pc.classList.contains('sel')){pc.classList.remove('sel');SA=SA.filter(y=>y!=='premium_support_all')}}
if(g==='support_premium'){document.querySelectorAll('[data-group="support"]').forEach(x=>{x.classList.remove('sel');SA=SA.filter(y=>y!==x.dataset.addon)})}
c.classList.add('sel');SA.push(a);updatePricing()}
function calcTotals(){let o=0,m=0;if(SP)o+=PP[SP];o+=ST.length*TP;SA.forEach(a=>{const c=document.querySelector('[data-addon="'+a+'"]');if(c){const pr=parseInt(c.dataset.price);c.dataset.type==='monthly'?m+=pr:o+=pr}});return{o,m}}
function fP(a){return'$'+a.toLocaleString('en-US')}
function updatePricing(){const{o,m}=calcTotals();document.getElementById('sOT').textContent=fP(o);document.getElementById('sMO').textContent=fP(m)+'/mo';document.getElementById('mOT').textContent=fP(o);document.getElementById('mMO').textContent=fP(m)+'/mo';updateSB()}
function updateSB(){const el=document.getElementById('sbC');let h='';if(SP){const n=SP==='template'?'Template Launch':'Custom Build';h+='<div class="gp-sl2"><span class="lb">'+n+'</span><span class="vl">'+fP(PP[SP])+'</span></div>'}
if(ST.length>0)h+='<div class="gp-sl2"><span class="lb">Additional Treatments ('+ST.length+')</span><span class="vl">'+fP(ST.length*TP)+'</span></div>';
SA.forEach(a=>{const c=document.querySelector('[data-addon="'+a+'"]');if(c){const pr=parseInt(c.dataset.price),sf=c.dataset.type==='monthly'?'/mo':'';h+='<div class="gp-sl2"><span class="lb">'+AN[a]+'</span><span class="vl">'+fP(pr)+sf+'</span></div>'}});
if(!h)h='<div class="gp-sl2"><span class="lb">Select a package...</span></div>';
el.innerHTML=h;document.getElementById('mExp').innerHTML=h?'<div style="padding-top:8px">'+h+'</div>':''}
function goToStep(s){if(s===2&&!SP)return;document.querySelectorAll('.gp-sec').forEach(x=>x.classList.remove('active'));document.getElementById('step'+s).classList.add('active');
document.querySelectorAll('.gp-st').forEach((ps,i)=>{const n=i+1;ps.classList.remove('active','completed');if(n===s)ps.classList.add('active');else if(n<s){ps.classList.add('completed');ps.querySelector('.gp-dot').innerHTML='✓'}else ps.querySelector('.gp-dot').textContent=n});
document.querySelectorAll('.gp-conn').forEach((c,i)=>{i<s-1?c.classList.add('completed'):c.classList.remove('completed')});
document.getElementById('sSI').textContent='Step '+s+' of 5';
const sb=document.getElementById('sidebar'),mb=document.getElementById('mBar');
if(s===1){sb.style.display='none';mb.style.display='none'}else{if(window.innerWidth>=1024)sb.style.display='block';if(window.innerWidth<1024)mb.style.display='block'}
CS=s;if(s===4)buildSummary();window.scrollTo({top:0,behavior:'smooth'})}
function toggleMB(){document.getElementById('mBar').classList.toggle('exp')}
function buildSummary(){const{o,m}=calcTotals();let h='<div class="su-s"><div class="su-st">Package</div>';
if(SP){const n=SP==='template'?'Template Launch':'Custom Build';h+='<div class="su-i"><span>'+n+'</span><span>'+fP(PP[SP])+'</span></div>'}
h+='</div><div class="su-s"><div class="su-st">Treatments</div>';
h+='<div class="su-i"><span>Semaglutide GLP-1</span><span class="inc">Included</span></div>';
h+='<div class="su-i"><span>Tirzepatide GLP-1/GIP</span><span class="inc">Included</span></div>';
h+='<div class="su-i"><span>NAD+</span><span class="inc">Included</span></div>';
h+='<div class="su-i"><span>Sermorelin</span><span class="inc">Included</span></div>';
ST.forEach(t=>{h+='<div class="su-i"><span>'+TN[t]+'</span><span>+'+fP(TP)+'</span></div>'});h+='</div>';
const oa=SA.filter(a=>{const c=document.querySelector('[data-addon="'+a+'"]');return c&&c.dataset.type==='onetime'});
const ma=SA.filter(a=>{const c=document.querySelector('[data-addon="'+a+'"]');return c&&c.dataset.type==='monthly'});
if(oa.length){h+='<div class="su-s"><div class="su-st">Add-Ons (One-Time)</div>';oa.forEach(a=>{const c=document.querySelector('[data-addon="'+a+'"]');h+='<div class="su-i"><span>'+AN[a]+'</span><span>+'+fP(parseInt(c.dataset.price))+'</span></div>'});h+='</div>'}
if(ma.length){h+='<div class="su-s"><div class="su-st">Add-Ons (Monthly)</div>';ma.forEach(a=>{const c=document.querySelector('[data-addon="'+a+'"]');h+='<div class="su-i"><span>'+AN[a]+'</span><span>+'+fP(parseInt(c.dataset.price))+'/mo</span></div>'});h+='</div>'}
h+='<div class="su-dv"></div><div class="su-tr"><span>ONE-TIME TOTAL</span><span class="vl">'+fP(o)+'</span></div>';
h+='<div class="su-tr"><span>MONTHLY RECURRING</span><span class="vl">'+fP(m)+'/mo</span></div>';
h+='<p class="su-fp">Ad spend not included. Billed separately per invoice. Pricing subject to change at sole discretion of GrowPro by Kickstart Social LLC.</p>';
document.getElementById('sumC').innerHTML=h}
function submitForm(){const fn=document.getElementById('firstName').value.trim(),em=document.getElementById('email').value.trim();let v=true;
document.getElementById('firstName').classList.remove('err');document.getElementById('email').classList.remove('err');
document.getElementById('fnE').classList.remove('show');document.getElementById('emE').classList.remove('show');
if(!fn){document.getElementById('firstName').classList.add('err');document.getElementById('fnE').classList.add('show');v=false}
if(!em||!em.includes('@')||!em.includes('.')){document.getElementById('email').classList.add('err');document.getElementById('emE').classList.add('show');v=false}
if(!v)return;const{o,m}=calcTotals();
const oa=SA.filter(a=>{const c=document.querySelector('[data-addon="'+a+'"]');return c&&c.dataset.type==='onetime'}).map(a=>AN[a]);
const ma=SA.filter(a=>{const c=document.querySelector('[data-addon="'+a+'"]');return c&&c.dataset.type==='monthly'}).map(a=>AN[a]);
const payload={first_name:fn,last_name:document.getElementById('lastName').value.trim(),email:em,phone:document.getElementById('phone').value.trim(),source:document.getElementById('source').value,package:SP==='template'?'Template Launch':'Custom Build',one_time_setup:PP[SP],treatments_added:ST.map(t=>TN[t]),addons_one_time:oa,addons_monthly:ma,total_one_time:o,total_monthly:m};
if(WEBHOOK_URL&&WEBHOOK_URL!=="YOUR_GHL_WEBHOOK_URL_HERE"){fetch(WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(e=>console.log('Webhook error:',e))}else{console.log('Webhook payload:',JSON.stringify(payload,null,2))}
document.getElementById('formV').classList.add('hid');document.getElementById('confV').classList.remove('hid');
document.getElementById('sidebar').style.display='none';document.getElementById('mBar').style.display='none';
buildSummary();document.getElementById('confSum').innerHTML=document.getElementById('sumC').innerHTML;
document.querySelectorAll('.gp-st').forEach(ps=>{ps.classList.remove('active');ps.classList.add('completed');ps.querySelector('.gp-dot').innerHTML='✓'});
document.querySelectorAll('.gp-conn').forEach(c=>c.classList.add('completed'))}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('sidebar').style.display='none';document.getElementById('mBar').style.display='none';updatePricing()});
