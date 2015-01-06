(function(){
      var endFun; 
      $(function(){
        $('.intro .close').click(function(){
          end();
        });
      });

      function play(){
        $('.intro').show();//show intro
        var vid = document.getElementById("video");
        vid.play();
        vid.onended = function() {
            end();
        };
      }

      function end(){
        var vid = document.getElementById("video");
        vid.pause();
        $('.intro').hide();//Hide video element
        if(endFun && typeof endFun == 'function'){
          endFun();
        }
      }

      function onEnd(fun){
        endFun = fun;//Save for later
      }

      window.introVideo = {
        play: play,
        end: end,
        onEnd: onEnd
      }
})();