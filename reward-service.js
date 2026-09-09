(function(){
'use strict';
function ensure(){const d=window.data||{};d.rewardTransactions=d.rewardTransactions||[];d.rewardBalances=d.rewardBalances||{};return d;}
function recalc(){const d=ensure(),b={};for(const tx of d.rewardTransactions){if(tx.status&&tx.status!=='SAVED')continue;b[tx.reward_type]=(b[tx.reward_type]||0)+Number(tx.amount||0);}if(Object.keys(d.rewardBalances||{}).length){for(const [k,v] of Object.entries(d.rewardBalances))b[k]=Number(v||0);}d.rewardBalances=b;d.shinyStars=b.MAGIC_STAR||0;return b;}
function balance(type='MAGIC_STAR'){return recalc()[type]||0;}
function snapshot(){return {...recalc()};}
function transactionForCompletion(completionId,type='MAGIC_STAR'){return ensure().rewardTransactions.find(x=>x.idempotency_key===`${completionId}:${type}`||x.idempotency_key?.startsWith(`${completionId}:${type}`))||null;}
function recordForActivity(){throw new Error('Reward issuance is owned by atomic complete_activity; RewardService is read-only in the browser.');}
window.RewardService=Object.freeze({balance,snapshot,recalculate:recalc,transactionForCompletion,recordForActivity,authoritativeIssuer:'SUPABASE_COMPLETE_ACTIVITY'});
})();
