var i = document.querySelector("#div")

var tl = gsap.timeline(
    {
        repeat:-1
    }
)
tl.to(i,{
  
    y:20,
    duration:1,
    

})
tl.to(i,{
    y:0,
    duration:1,

})