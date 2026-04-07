import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, MapPin, Calendar, Clock, ChevronDown, Plus, Minus, CheckCircle } from 'lucide-react';

const App = () => {
  const [envelopeState, setEnvelopeState] = useState('closed');
  const [showMainSite, setShowMainSite] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const PDF_GREEN = '#828E63';
  const TEXT_DARK = '#2A2A2A';

  // --- STATO DEL FORM ---
  const [rsvpData, setRsvpData] = useState({
    attendance: '',
    guestCount: 1,
    name: '',
    email: '',
    dietary: '',
    kids: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'closed') return;
    setEnvelopeState('opening');
    setTimeout(() => setEnvelopeState('opened'), 1500);
    setTimeout(() => {
      setShowMainSite(true);
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 3000);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStart = () => {
    setShowIntro(false);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // --- FUNZIONE PER INVIARE L'EMAIL ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    // La tua chiave Web3Forms
    formData.append("access_key", "ead71948-8051-4916-9e05-8ea3a605c4f8"); 
    
    // Configurazione dell'email che riceverai
    formData.append("subject", `Nuovo RSVP da ${rsvpData.name || 'Ospite'}`);
    formData.append("Parteciperà", rsvpData.attendance === 'yes' ? 'SÌ, sarà presente' : 'NO, non potrà esserci');
    
    if (rsvpData.attendance === 'yes') {
      formData.append("Numero Invitati", rsvpData.guestCount);
      formData.append("Nome Contatto", rsvpData.name);
      formData.append("Email Contatto", rsvpData.email);
      formData.append("Esigenze Alimentari", rsvpData.dietary || 'Nessuna');
      formData.append("Bambini", rsvpData.kids === 'yes' ? 'Sì' : 'No');
    }
    
    if (rsvpData.message) {
      formData.append("Messaggio per gli sposi", rsvpData.message);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Si è verificato un errore. Riprova più tardi.");
      }
    } catch (error) {
      alert("Errore di connessione. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FLOWER_SRC = "https://i.imgur.com/lAAZkzT.png";
  const AUDIO_SRC = "https://assets.mixkit.co/music/preview/mixkit-romantic-piano-122.mp3";
  const VIDEO_SRC = "https://i.imgur.com/NdiU0HU.mp4";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#2A2A2A] overflow-x-hidden selection:bg-[#828E63] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@200;300;400&display=swap');
        
        .font-names { font-family: 'Playfair Display', serif; }
        .font-details { font-family: 'Cinzel', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        
        .perspective-1000 { perspective: 1000px; }
        .flap { transform-origin: top; transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .flap.open { transform: rotateX(180deg); z-index: 10; }
        .letter { transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1) 1s; }
        .letter.rise { transform: translateY(-130px); }
        .envelope-wrapper { transition: transform 2.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 2s ease 1.5s; }
        .envelope-wrapper.zoom-out { transform: scale(4); opacity: 0; }

        .premium-fade-in { animation: premiumFadeIn 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(30px); }
        @keyframes premiumFadeIn { to { opacity: 1; transform: translateY(0); } }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        
        .premium-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #E5E5E5;
          padding: 12px 0;
          width: 100%;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          transition: border-color 0.3s ease;
          border-radius: 0;
          color: ${TEXT_DARK};
        }
        .premium-input:focus { outline: none; border-bottom-color: ${PDF_GREEN}; }
      `}} />

      <audio ref={audioRef} loop>
        <source src={AUDIO_SRC} type="audio/mpeg" />
      </audio>

      {/* --- INTRO SCREEN --- */}
      {/* Aggiunto bg-[#1A1A1A] per sicurezza così i testi si leggono sempre! */}
      <div className={`fixed inset-0 z-[60] bg-[#1A1A1A] transition-opacity duration-1000 flex flex-col ${showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
        
        {/* HITBOX INVISIBILE PER IL CUPIDO: cliccando a destra si apre l'invito! */}
        <div 
          onClick={handleStart} 
          className="absolute top-0 right-0 w-1/2 h-full z-20 cursor-pointer"
          title="Clicca per aprire"
        ></div>

        <div className="relative z-10 flex flex-col items-center justify-end pb-12 h-full w-full text-white pointer-events-none">
          <div className="flex flex-col items-center mb-8">
            <p className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase mb-3 opacity-90 drop-shadow-md">
              Ci Sposiamo
            </p>
            <h1 className="font-names text-5xl sm:text-6xl md:text-7xl drop-shadow-lg text-center leading-tight mb-4">
              Francesco <span className="italic text-3xl sm:text-4xl mx-2 font-light text-white/90">e</span> Zozan
            </h1>
            <p className="font-details text-[10px] sm:text-xs md:text-sm tracking-[0.3em] opacity-90 drop-shadow-md">
              27 LUGLIO 2026
            </p>
          </div>
          
          <button onClick={handleStart} className="pointer-events-auto flex flex-col items-center justify-center font-sans text-[9px] tracking-[0.3em] uppercase opacity-80 hover:opacity-100 transition-opacity cursor-pointer mt-2">
            <span className="mb-2 drop-shadow-md">Apri l'invito</span>
            <ChevronDown size={24} className="animate-bounce drop-shadow-md" />
          </button>
        </div>
      </div>

      {/* --- MUSIC TOGGLE BUTTON --- */}
      {!showIntro && (
        <button onClick={toggleMusic} className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#111] border border-gray-200 shadow-sm transition-all hover:border-[#828E63]">
          {isPlaying ? <Pause size={16} strokeWidth={1.5} /> : <Play size={16} strokeWidth={1.5} className="ml-1" />}
        </button>
      )}

      {/* --- ENVELOPE SCREEN --- */}
      {!showIntro && !showMainSite && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0A] z-50 animate-in fade-in duration-1000">
          <div className={`envelope-wrapper relative w-80 h-56 cursor-pointer perspective-1000 ${envelopeState === 'opened' ? 'zoom-out' : ''}`} onClick={handleOpenEnvelope}>
            <div className="absolute inset-0 bg-[#EFEFEF] rounded shadow-2xl border border-white/10"></div>
            <div className={`letter absolute left-3 right-3 bottom-0 h-52 bg-white rounded-t border border-gray-100 shadow-lg flex flex-col items-center justify-top pt-10 ${envelopeState !== 'closed' ? 'rise' : ''}`}>
               <span style={{color: PDF_GREEN}} className="font-names text-4xl tracking-widest">
                 F <span className="text-2xl italic mx-1">e</span> Z
               </span>
               <div style={{backgroundColor: PDF_GREEN}} className="w-8 h-[1px] my-4 opacity-50"></div>
               <span className="font-sans text-[9px] tracking-[0.3em] text-[#666] uppercase">Invito Ufficiale</span>
            </div>
            <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-md">
              <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)', backgroundColor: '#F9F9F9' }}></div>
              <div className="absolute inset-0" style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)', backgroundColor: '#F9F9F9' }}></div>
              <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)', backgroundColor: '#FFFFFF' }}></div>
            </div>
            <div className={`flap absolute top-0 left-0 right-0 h-32 bg-[#F4F4F4] origin-top z-30 flex items-center justify-center shadow-sm ${envelopeState !== 'closed' ? 'open' : ''}`} style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}>
              {envelopeState === 'closed' && (
                <div style={{backgroundColor: PDF_GREEN}} className="absolute bottom-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50">
                  <span className="font-names italic text-white text-lg">FZ</span>
                </div>
              )}
            </div>
            {envelopeState === 'closed' && (
               <div className="absolute -bottom-20 left-0 right-0 text-center text-white/50 font-sans text-xs tracking-[0.3em] uppercase transition-opacity hover:text-white/80">
                 Tocca per aprire
               </div>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN WEBSITE --- */}
      {showMainSite && (
        <div className="relative animate-in fade-in duration-[2000ms]">

          {/* 1. HERO SECTION */}
          <section className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center pt-20 pb-10 border-b border-gray-100">
            <div className="premium-fade-in w-full max-w-2xl mx-auto relative z-10 flex flex-col items-center">
              <p style={{color: PDF_GREEN}} className="font-details text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-10 leading-loose">
                SONO FELICI DI INVITARVI <br/> AL LORO MATRIMONIO
              </p>

              <div className="mb-10">
                <p style={{color: PDF_GREEN}} className="font-details text-lg sm:text-xl tracking-[0.2em] mb-2">
                  27.07.2026
                </p>
                <p style={{color: PDF_GREEN}} className="font-details text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-2">
                  ORE 17:00
                </p>
              </div>
              
              <h1 style={{color: PDF_GREEN}} className="font-names text-6xl sm:text-7xl md:text-8xl leading-tight mb-8">
                FRANCESCO <br />
                <span className="font-names italic text-4xl sm:text-5xl lowercase my-4 block">e</span>
                ZOZAN
              </h1>

              <img src={FLOWER_SRC} alt="Fiore Decorativo" className="w-24 md:w-32 my-8 object-contain" style={{ animation: 'float 8s ease-in-out infinite' }} />

              <div className="mt-8">
                <h2 style={{color: TEXT_DARK}} className="font-details text-[10px] sm:text-[11px] tracking-[0.2em] uppercase mb-4">
                  CERIMONIA E RICEVIMENTO PRESSO
                </h2>
                <h3 style={{color: PDF_GREEN}} className="font-details text-2xl sm:text-3xl tracking-widest mb-4">
                  BAGLIO SANTA LUCIA
                </h3>
                <p style={{color: TEXT_DARK}} className="font-details text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">
                  VIA PIER MARIA ROSSO, 41 - 91011 ALCAMO (TP)
                </p>
              </div>
            </div>
            <ChevronDown size={24} strokeWidth={1} style={{color: PDF_GREEN}} className="absolute bottom-10 animate-bounce opacity-50" />
          </section>

          {/* 2. RSVP SECTION */}
          <section className="py-32 px-6 bg-[#FAFAFA] relative overflow-hidden" id="rsvp">
            <img src={FLOWER_SRC} alt="Fiore Decorativo" className="absolute top-10 left-0 w-32 md:w-48 opacity-70 object-contain" style={{ animation: 'float 8s ease-in-out infinite' }} />
            
            <div className="max-w-xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 style={{color: PDF_GREEN}} className="font-names text-5xl tracking-widest mb-8">RSVP</h2>
                <p style={{color: PDF_GREEN}} className="font-details text-[11px] sm:text-xs tracking-[0.2em] uppercase mb-4 leading-loose">
                  È GRADITA GENTILE CONFERMA <br/> ENTRO IL 27 GIUGNO 2026
                </p>
              </div>

              {!isSuccess ? (
                <form className="bg-white p-8 sm:p-14 border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-12 animate-in fade-in" onSubmit={handleSubmit}>
                  
                  <div className="space-y-6">
                    <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#111] text-center">Parteciperai? *</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 flex items-center justify-center p-4 border cursor-pointer transition-all duration-300 ${rsvpData.attendance === 'yes' ? `border-[${PDF_GREEN}] bg-[${PDF_GREEN}] text-white` : 'border-gray-200 hover:border-gray-300 text-[#666]'}`}>
                        <input type="radio" name="attendance" value="yes" className="hidden" onChange={() => setRsvpData({...rsvpData, attendance: 'yes'})} required />
                        <span className="font-sans text-xs tracking-widest uppercase">Sì, sarò presente</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center p-4 border cursor-pointer transition-all duration-300 ${rsvpData.attendance === 'no' ? 'border-gray-300 bg-gray-50 text-gray-400' : 'border-gray-200 hover:border-gray-300 text-[#666]'}`}>
                        <input type="radio" name="attendance" value="no" className="hidden" onChange={() => setRsvpData({...rsvpData, attendance: 'no'})} required />
                        <span className="font-sans text-xs tracking-widest uppercase">Non posso</span>
                      </label>
                    </div>
                  </div>

                  {rsvpData.attendance === 'yes' && (
                    <div className="space-y-10 animate-in fade-in duration-700">
                      
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#111]">Numero di invitati</label>
                        <div className="flex items-center space-x-6">
                          <button type="button" onClick={() => setRsvpData({...rsvpData, guestCount: Math.max(1, rsvpData.guestCount - 1)})} style={{color: PDF_GREEN}} className="transition-colors opacity-70 hover:opacity-100"><Minus size={16} strokeWidth={1} /></button>
                          <span className="font-details text-2xl w-6 text-center text-[#2A2A2A]">{rsvpData.guestCount}</span>
                          <button type="button" onClick={() => setRsvpData({...rsvpData, guestCount: rsvpData.guestCount + 1})} style={{color: PDF_GREEN}} className="transition-colors opacity-70 hover:opacity-100"><Plus size={16} strokeWidth={1} /></button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <p style={{color: PDF_GREEN}} className="font-sans text-[9px] tracking-[0.3em] uppercase">Persona 1 (Contatto principale)</p>
                        <div className="space-y-6">
                          <input type="text" placeholder="NOME COMPLETO" required className="premium-input uppercase tracking-wider text-[#2A2A2A]" value={rsvpData.name} onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})} />
                          <input type="email" placeholder="EMAIL" required className="premium-input uppercase tracking-wider text-[#2A2A2A]" value={rsvpData.email} onChange={(e) => setRsvpData({...rsvpData, email: e.target.value})} />
                        </div>
                      </div>

                      <div>
                        <input type="text" placeholder="ESIGENZE ALIMENTARI (Vegetariano, Allergie...)" className="premium-input uppercase tracking-wider text-[#2A2A2A]" value={rsvpData.dietary} onChange={(e) => setRsvpData({...rsvpData, dietary: e.target.value})} />
                      </div>

                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#111]">Ci saranno bambini?</label>
                        <div className="flex gap-8">
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-3 h-3 border rounded-full flex items-center justify-center transition-colors ${rsvpData.kids === 'yes' ? `border-[${PDF_GREEN}]` : 'border-gray-300'}`}>
                              {rsvpData.kids === 'yes' && <div style={{backgroundColor: PDF_GREEN}} className="w-1.5 h-1.5 rounded-full"></div>}
                            </div>
                            <input type="radio" name="kids" className="hidden" onChange={() => setRsvpData({...rsvpData, kids: 'yes'})} />
                            <span className="font-sans text-xs tracking-widest uppercase text-[#666]">Sì</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-3 h-3 border rounded-full flex items-center justify-center transition-colors ${rsvpData.kids === 'no' ? `border-[${PDF_GREEN}]` : 'border-gray-300'}`}>
                              {rsvpData.kids === 'no' && <div style={{backgroundColor: PDF_GREEN}} className="w-1.5 h-1.5 rounded-full"></div>}
                            </div>
                            <input type="radio" name="kids" className="hidden" onChange={() => setRsvpData({...rsvpData, kids: 'no'})} />
                            <span className="font-sans text-xs tracking-widest uppercase text-[#666]">No</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <textarea rows="2" placeholder="MESSAGGIO PER GLI SPOSI (OPZIONALE)" className="premium-input resize-none uppercase tracking-wider text-[#2A2A2A]" value={rsvpData.message} onChange={(e) => setRsvpData({...rsvpData, message: e.target.value})}></textarea>
                      </div>
                    </div>
                  )}

                  {rsvpData.attendance === 'no' && (
                     <div className="space-y-6 animate-in fade-in duration-700">
                        <input type="text" placeholder="IL TUO NOME E COGNOME" required className="premium-input uppercase tracking-wider text-[#2A2A2A]" value={rsvpData.name} onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})} />
                        <textarea rows="2" placeholder="VUOI LASCIARCI UN MESSAGGIO? (OPZIONALE)" className="premium-input resize-none uppercase tracking-wider text-[#2A2A2A]" value={rsvpData.message} onChange={(e) => setRsvpData({...rsvpData, message: e.target.value})}></textarea>
                     </div>
                  )}

                  <button type="submit" style={{backgroundColor: PDF_GREEN}} className="w-full hover:opacity-90 text-white py-5 font-sans text-[10px] tracking-[0.4em] uppercase transition-opacity duration-300 mt-8 disabled:opacity-30" disabled={!rsvpData.attendance || isSubmitting}>
                    {isSubmitting ? 'Invio in corso...' : 'Invia Conferma'}
                  </button>
                </form>
              ) : (
                <div className="bg-white p-12 sm:p-16 border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center text-center animate-in zoom-in duration-500">
                  <CheckCircle size={48} strokeWidth={1} style={{color: PDF_GREEN}} className="mb-6" />
                  <h3 className="font-names text-3xl mb-4 text-[#111]">Grazie!</h3>
                  <p className="font-sans text-xs tracking-widest text-[#666] uppercase leading-relaxed">
                    Abbiamo ricevuto la tua conferma.<br/>
                    Non vediamo l'ora di festeggiare!
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 3. GIFT SECTION */}
          <section className="py-24 px-6 bg-white text-center border-t border-gray-100">
             <div className="max-w-2xl mx-auto">
                <p style={{color: PDF_GREEN}} className="font-details text-[11px] sm:text-xs tracking-[0.2em] uppercase leading-loose mb-12">
                  IL PENSIERO PIÙ BELLO CHE POSSIATE FARCI <br className="hidden md:block" /> 
                  È ESSERE PRESENTI NEL NOSTRO GRANDE GIORNO! <br/>
                  SE DESIDERATE CONTRIBUIRE AL NOSTRO FUTURO:
                </p>
                
                <div className="p-8">
                  <p style={{color: PDF_GREEN}} className="font-details text-lg sm:text-2xl tracking-widest mb-4 select-all">
                    IBAN DE57 1001 1001 2621 2775 12
                  </p>
                  <p style={{color: PDF_GREEN}} className="font-details text-[10px] sm:text-xs tracking-[0.2em] uppercase">
                    INTESTATO A: FRANCESCO PALAZZOLO
                  </p>
                </div>
             </div>
          </section>

          {/* 4. FOOTER */}
          <footer className="py-16 text-center bg-[#FAFAFA] relative overflow-hidden border-t border-gray-100">
            <h2 style={{color: PDF_GREEN}} className="font-names text-3xl relative z-10">Francesco <span className="italic text-2xl mx-2">e</span> Zozan</h2>
            <p style={{color: TEXT_DARK}} className="font-details text-[9px] tracking-[0.4em] mt-6 relative z-10">27 LUGLIO 2026</p>
          </footer>

        </div>
      )}
    </div>
  );
};

export default App;
