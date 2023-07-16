const gfName = "MrsRandom";
const gfName1 = "MrsRandom1";
const gfName2 = "MrsRandom2";
//module.exports = gfName;  //this can be exported anywhere now

export default gfName;
export{gfName1,gfName2};

export const fn = ()=>{
  return `${~~ (Math.random()*100)}%`; //~~ is Math.floor
};