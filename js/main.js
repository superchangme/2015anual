/**
 * Created by tom.chang on 2015/3/10.
 */
(function(){

})();


var angle;
var canvas;
var stage;
var container;
var people=[];
var peoplePosArr=[];
//var hideArr=[0,1,2,3,4,5,15,14,13,12,11,10,16, 17, 18, 19, 28, 29, 30, 31, 32, 33, 46, 47, 48, 63, 128, 143, 144, 145, 158, 159, 160, 161, 162, 163, 175, 174, 173, 172];
var hideArr=[0,1,2,11,10,9,12,23, 22, 35,24,60,71,72,82,83,84,85,95,94,93];
var max=96;//mc的总数量
var total_col=12;//横排mc的数量
var total_show=120;
var _scaleAll=scaleAll();
var cur_time;
var throttle=2000;
var scaleRange=[0.6,0.8,1,1.2];
var targetPdf = [0.1,0.2,0.4,0.3];
var targetCdf = pdf2cdf(targetPdf);
var cur_index=0;
var hidePeopleArr=[];
var mcWidth=65;
var imgWidth=mcWidth-15;
var anim_counts=0;
var mess_comet_interval=500;
var people_comet_interval=2000;
var cur_people_id=null;
var cur_mess_id=null;
var messList=$(".mess-list");
var messPos=0;
var messTmpl=tmpl("messTmpl");
var isScrollArr=[false,false];
var messListHeight=$(".mess-list-box").height();
var messBoxHeight=140;
var scrollNow=_scrollNow();
var comingLock=false;
var indexArr=(function(max,arr){
    for(var i=0;i<max;i++){
        if(hideArr.indexOf(i)==-1){
            arr.push(i);
        }
    }
    arr.sort(function(a,b){
        return Math.random()>0.5
    });
    return arr
})(max,[]);
//var h:int=

function init() {
    //examples.showDistractor();
    //wait for the image to load
    var mask=new createjs.Shape();
    canvas = document.getElementById("mainCanvas");
    stage = new createjs.Stage(canvas);
    container = new createjs.Container().set({name: "container"});

    container.x=(canvas.width-total_col*mcWidth)/2+mcWidth/2;
    container.y=mcWidth;
    mask.graphics = new createjs.Graphics().beginFill("blue").rect(0, 0, canvas.width,(max/total_col)*mcWidth+mcWidth*2);
    container.mask=mask;
    stage.addChild(container);
    /*
     for(var i=0;i<100;i++){
     var img = new Image();
     var x=getRandom(area.min.x,area.max.x),y=getRandom(area.min.y,area.max.y);
     img.onload = proxy(handleImageLoad,img,x,y);
     img.src = "../_assets/art/apple.jpg";
     angle = 0;
     }*/

    createjs.Ticker.addEventListener("tick", tick);
}
//test
/*setInterval(function(){
    //&.p
    if(people.length<indexArr.length){
        addOne();
    }
},10)*/
function addOne(people){
    var i= getCurIndex();
    // for(var i=0;i<max;i++){
    if(hideArr.indexOf(i)==-1){
        /*      pMc.x=i%w*50//-Math.random()*20;
         //50   MC的宽度35     加上   15间距=50
         pMc.y=Math.floor(i/w)*50//-Math.random()*20;*/
        var img = new Image();
        var x=i%total_col*mcWidth+getRandom(-10,10),y=Math.floor(i/total_col)*mcWidth+getRandom(-10,10);
        img.onload = proxy(handleImageLoad,img,x,y,i);
        if(people&&people.headimgurl){
            comingLock=true;
            img.src = people.headimgurl;
        }
    }
    //}
}
function getCurIndex(){
    var index= indexArr[cur_index];
    cur_index=cur_index+1==indexArr.length?0:cur_index+1;
    return index;
}
function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}
function handleImageLoad(img,x,y,i) {
    var shape = new createjs.Shape();
    var bmp = new createjs.Bitmap(img);
    var width=imgWidth;
//    var scale=width/img.width;
//    var mtx = new createjs.Matrix2D().scale(scale,scale);
//    bmp.graphics.beginBitmapFill(img, "no-repeat",mtx).setStrokeStyle(2).beginStroke("white").drawCircle(0, 0, mcWidth);
    var bg=new createjs.Shape(new createjs.Graphics().beginFill("rgba(255,255,255,0.7)").drawCircle(0, 0, imgWidth/2+2));
    var child = new createjs.Container();
    var line=new createjs.Shape(new createjs.Graphics().beginStroke("rgba(221,221,221,0.7)").moveTo(400-x, canvas.height-y).lineTo(0, 0).endStroke());
//            console.log(x,y)
    shape.graphics = new createjs.Graphics().drawCircle(0, 0, width/2).endStroke();
    shape.x=width/2-imgWidth/2;
    shape.y=width/2-imgWidth/2;
    bmp.mask=shape;
    bmp.x=0-imgWidth/2;
    bmp.y=0-imgWidth/2;
    bmp.scaleX=bmp.scaleY=width/img.width;

    child.alpha=0;
    child.index=i;
    child.width=child.height=width;
    child.x=x;
    child.y=y;
    child.addChild(bg);
    child.addChild(bmp);
    child.scaleX=child.scaleY=scaleRange[discreteSampling(targetCdf)];
    container.addChild(child);
    people.push(child);
    peoplePosArr.push(i);
    animOne(child,null,line);
    //stage.addChild(shape2)
    stage.update();
    /*return

    //find canvas and load images, wait for last image to load
    var  star;
    // create a new stage and point it at our canvas:

    // masks can only be shapes.
    star = new createjs.Shape();
    // the mask's position will be relative to the parent of its target:
    star.x = img.width / 2;
    star.y = img.height / 2;
    // only the drawPolyStar call is needed for the mask to work:
    //star.graphics.beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0, 0, img.height / 2 - 15, 5, 0.6).closePath();

    star.graphics.beginStroke("#FF0").setStrokeStyle(5).drawCircle(40, 40, 40).closePath();
    var bg = new createjs.Bitmap(img);
    // blur and desaturate the background image:
    bg.filters = [new createjs.BlurFilter(2, 2, 2), new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, 0, -100, 0))];
    bg.cache(0, 0, img.width, img.height);
    stage.addChild(bg);

    var bmp = new createjs.Bitmap(img);
    stage.addChild(bmp);
    bmp.mask = star;

    // note that the shape can be used in the display list as well if you'd like, or
    // we can reuse the Graphics instance in another shape if we'd like to transform it differently.
    stage.addChild(star);*/
}

function tick(event) {
    /*if(container.x>100||container.x<-100){
     step=-step;
     }
     container.x+=step;*/
    var now=+new Date;
    //每隔100ms放大缩小头像
    if(now-cur_time>throttle&&!comingLock){
        if(hidePeopleArr.length>total_show-max){
            switchShow();
            //_scaleAll()
        }
        cur_time=now;
    }
    stage.update(event);
    // angle += 0.025;
}
//单个进场动画
function animOne(target,linkOne,line){
    var _linkOne=linkOne;
    if(peoplePosArr.length>total_show){
        _linkOne=getSamePos(target);
    }
    if(_linkOne){
        createjs.Tween.get(_linkOne)
            .to({alpha: 0}, throttle*0.5,createjs.Ease.sineOut)
            .call(function(){
                hidePeopleArr.push(_linkOne)
            });
    }
    createjs.Tween.get(target)
        .to({alpha: 1}, throttle*0.5,createjs.Ease.sineInOut)
        .call(function(){
//            if(line&&(people.length<max||people.length%2==0)){
                target.addChildAt(line,0);
//            }
            comingLock=false;
            if(!linkOne){
               animLikeBall(target);
            }
        });
}
function animLikeBall(target){
    if(Math.random()>0.5){
        var mx,my,x1,y1,x2,y2;
        mx=Math.random()>0.5?getRandom(2,10):getRandom(-10,-2);
        my=-mx;
        x1=target.x+mx;
        y1=target.y+my;
        x2=target.x-mx;
        y2=target.y-my;
        createjs.Tween.get(target).to({x:x1,y:y1},500).to({x:target.x,y:target.y},500).to({x:x2,y:y2},500).to({x:target.x,y:target.y},500);

    }
    setTimeout(function(){
        animLikeBall(target);
    },2000)
}
function getSamePos(target){
    /*if(target.linkOne){
        return target.linkOne;
    }*/
    for(var i= 0,l=people.length;i<l;i++){
        if(people[i]!=target&&people[i].index==target.index&&people[i].alpha==1){
//            target.linkOne=people[i];
//            people[i].linkOne=target;
            return people[i];
        }
    }
}

//切换显示
function switchShow(){
    if(anim_counts!=0&&anim_counts%10==0){
        hidePeopleArr.sort(function(){
            return Math.random()>0.5;
        })
    }
    anim_counts++;
    var counts=getRandom(4,8);
    for(var i= 0;i<counts;i++){
        if(hidePeopleArr[i]&&hidePeopleArr[i].alpha==0){
            if(hidePeopleArr[i].linkOne){
                animOne(hidePeopleArr[i],hidePeopleArr[i].linkOne)
            }
        }
    }
    hidePeopleArr.push(hidePeopleArr.splice(0,counts));
}
function scaleAll(){
    var isBack=false,_o,big,small;
    return function(){
        if(!isBack){
            _o=scaleSome(5,peoplePosArr,10,16);
            big=_o.big;
            small=_o.small;
            for(var i=0;i<big.length;i++){
                people[big[i]].scaleX=people[big[i]].scaleY=1.3
            }
            /* for(var i=0;i<small.length;i++){
             people[small[i]].scaleX=people[small[i]].scaleY=0.7
             }*/
            isBack=true;
        }else{
            for(var i=0;i<big.length;i++){
                people[big[i]].scaleX=people[big[i]].scaleY=1
            }
            for(var i=0;i<small.length;i++){
                people[small[i]].scaleX=people[small[i]].scaleY=1
            }
            isBack=false;
        }
    }
}
function scaleSome(num,posArr,row,column){
    var big=[],small=[],p=posArr.slice(),one,_row,_col,tempArr,index;
    for(var i=0;i<num;i++){
        one= p.splice(getRandom(0,p.length-1),1)[0];
        big.push(getMcByIndex(one,posArr));
        _col=one%column;
        _row=Math.floor(one/column);
        tempArr=getNearBy(_row,_col,row,column);
        for(var j= 0,l=tempArr.length;j<l;j++){
            index=getMcByIndex(tempArr[j],posArr);
            if(index!=-1){
                small.push(index/*people[index]*/);
                p.splice(getMcByIndex(index,p),1);
            }
        }
    }
    return {big:big,small:small};
}
function getMcByIndex(index,p){
    for(var i= 0,l= p.length;i<l;i++){
        if(p[i]==index){
            return i
        }
    }
    return -1
}
function getNearBy(row,col,rows,cols){
    var arr=[];
    if(col-1>=0){
        arr.push(row*cols+col-1)
        //arr.push({row:row-1,col:col})
    }
    if(col+1<=cols-1){
        arr.push(row*cols+col+1)
        // arr.push({row:row,col:col})
    }
    if(row-1>=0){
        arr.push((col-1)*rows+col)
        //arr.push({row:row-1,col:col-1})
    }
    if(row+1<=rows-1){
        arr.push((col+1)*rows+col)
        //arr.push({row:row+1,col:col+1})
    }
    return arr;
}
function proxy(fc){
    var args=[].slice.call(arguments,1);
    return function(){
        fc.apply(null,args);
    }
}
//create by Milo  http://www.cnblogs.com/miloyip/archive/2010/04/21/1717109.html
function pdf2cdf(pdf) {
    var cdf = pdf.slice();

    for (var i = 1; i < cdf.length - 1; i++)
        cdf[i] += cdf[i - 1];
    // Force set last cdf to 1, preventing floating-point summing error in the loop.
    cdf[cdf.length - 1] = 1;

    return cdf;
}
function discreteSampling(cdf) {
    var x = Math.random();
    for (var i in cdf)
        if (x < cdf[i])
            return i;

    return -1; // should never runs here, assuming last element in cdf is 1
}

function  randomChar(l)  {
    var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
    var  tmp="";
    var timestamp = new Date().getTime();
    for(var  i=0;i<  l;i++)  {
        tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }
    return tmp;
    }
function addMess(body,data,listIndex){
    cur_time=+new Date;
    if(data&&data.mess_time){
        //显示时间
        data.ctime=formatTime(cur_time,data.mess_time);
    }
    var l=getRandom(10,200);
    data.mess=randomChar(l)
   // body.prepend(messTmpl(data));
    scrollList(body,listIndex,messTmpl(data));
}
//to backend
//推送消息
/*setInterval(function(){
    $.post(app.getPeopleUrl,{id:cur_people_id},function(data){
          if(data.result+""=="true"){
              for(var i= 0,l=data.list.length;i<l;i++){
                  addOne(data.list[i]);
              }
              cur_people_id=data.list[l-1].id;
          }
    },"json")
},people_comet_interval/10);*/
//推送新签到
setInterval(function(){
    $.post(app.getMess,{id:cur_mess_id},function(data){
        if(data.result+""=="true"){
            var body;
            for(var i= 0,l=data.list.length;i<l;i++){
                //addOne(data.list[i]);
                if(messPos==0){
                    body=messList.eq(0);
                    messPos=1;
                }else{
                    body=messList.eq(1);
                    messPos=0;
                }
                addMess(body,data.list[i],messPos==0?1:0);
                cur_mess_id=data.list[l-1].id;
            }
        }
    },"json")
},mess_comet_interval);

setInterval(function(){
    refreshTime();
},30000);

function formatTime(now,mess_time){
   var delta=now-mess_time;
   if(delta<10000){
       return "刚刚";
   }else if(delta<30000){
       return "三十秒前";
   }else if(delta<60000){
       return "一分钟前"
   }else if(delta<120000){
       return "两分钟前";
   }else if(delta<300000){
       return "五分钟前";
   }else if(delta<600000){
       return "十分钟前";
   }else if(delta<1800000){
       return "三十分钟前";
   }else{
       return "一小时前";
   }
}

function refreshTime(){

}
//自动滚动
function scrollList(body,listIndex,data){
    if(!isScrollArr[listIndex]){
        scrollNow(body,data);
        isScrollArr[listIndex]=true;
    /*    if(body.height()>messListHeight){
            scrollNow(body,data);
            isScrollArr[listIndex]=true;
        }*/
    }else{
        scrollNow(body,data);
    }
}
function _scrollNow(){
    var deferList=[],isMoving=false;
    function scroll(body,data){
        isMoving=true;
       /* var top=body.data("top");
        if(!top){
            top=0;
        }*/
        top+=messBoxHeight;
        body.prepend(data);
        setTimeout(function(){
            var next=deferList.shift();
            isMoving=false;
            if(next){
                next();
            }
        },1000)
        /*body.data("top",top);
        body.animateNow({translate3d:"0,-"+top+"px,0"},1000,function(){
            var next=deferList.shift();
            isMoving=false;
            if(next){
                next();
            }
        });*/
    }
    function addDeferList(cb){
        deferList.push(cb);
    }
    return function(body,data){
        if(!isMoving){
            scroll(body,data);
        }else{
            addDeferList(scroll.bind(null,body,data));
        }
    }
}