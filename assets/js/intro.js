(function(){
      var endFun; 
      var el;
      var myPlayer;
      $(function(){
        $('.intro .close').click(function(){
          end();
        });

        videojs("intro_video").ready(function(){
          myPlayer = this;

          // Start playing the video.
          $('.intro').show();
          myPlayer.play();

          myPlayer.on('ended', function() {
              end();
          });
        });

      });

      function end(){
        myPlayer.pause();
        $('.intro').hide();//Hide video element
        if(endFun && typeof endFun == 'function'){
          endFun();
        }
      }

      function onEnd(fun){
        endFun = fun;//Save for later
      }

      window.introVideo = {
        // play: play,//Autoplay instead
        end: end,
        onEnd: onEnd
      }
})();