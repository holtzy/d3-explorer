// https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
function buildCirclePath(cx:number, cy:number, r:number){
    return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
}
