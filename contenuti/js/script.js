// Aggiungo l'anno al copyright in modo che si aggiorni automaticamente
const anno = document.getElementById("anno");
// verifico che esiste un elemento "anno"
if (anno) {
  anno.textContent = new Date().getFullYear();
}

// Gestico l'apertura e la chiusura del menu a forma di hamburger
const menu_hamburger = document.getElementById("hamburger");
const menu_links = document.getElementById("menu-links");

if (menu_hamburger && menu_links) {
  menu_hamburger.addEventListener("click", function () {
    menu_links.classList.toggle("attivo");
    menu_hamburger.classList.toggle("aperto");
  });

  const link_menu_click = menu_links.querySelectorAll("a");
  link_menu_click.forEach(function (menuClick) {
    menuClick.addEventListener("click", function () {
      menu_links.classList.remove("attivo");
      menu_hamburger.classList.remove("aperto");
    });
  });
}

// Attivo/disattivo la funziona chiaro/scuro e salvo e leggo la preferenza dell'utente
// in modo che nel caso di refesh della pagina rimane il chiaro o scuro in base alla scelta
// cambio icona del pulsante

const buttonTema = document.getElementById("button-tema");
const iconaTema = document.getElementById("icona-tema");

// Verifico che esistono entrambi gli elementi
if (buttonTema && iconaTema) {
  // controllo se l'utente aveva fatto una scelta
  const temaSalvato = localStorage.getItem("tema");
  if (temaSalvato === "scuro") {
    document.documentElement.setAttribute("data-theme", "scuro");
    iconaTema.innerHTML = "&#127769;";
  }

  buttonTema.addEventListener("click", function () {
    // leggo il tema attuale
    const temaAttuale = document.documentElement.getAttribute("data-theme");

    if (temaAttuale === "scuro") {
      // passa a tema chiaro
      document.documentElement.removeAttribute("data-theme");

      iconaTema.innerHTML = "&#9728;&#65039;";
      localStorage.setItem("tema", "chiaro");
    } else {
      // passa a tema scuro
      document.documentElement.setAttribute("data-theme", "scuro");
      iconaTema.innerHTML = "&#127769;";
      localStorage.setItem("tema", "scuro");
    }
  });
}

function mostraErrore(input, messaggio) {
  const gruppo = input.closest(".form-gruppo");
  const errore = gruppo.querySelector(".errore-campo");

  errore.textContent = messaggio;
  gruppo.classList.add("errore");
}

function rimuoviErrore(input) {
  const gruppo = input.closest(".form-gruppo");
  const errore = gruppo.querySelector(".errore-campo");

  errore.textContent = "";
  gruppo.classList.remove("errore");
}

// FORM DI CONTATTO
const formContatto = document.getElementById("form-contatto");
const buttonInvia = document.getElementById("button-invia");

function mostraMessaggioSuccesso() {
  const messaggioSuccesso = "Grazie, {nome}, il tuo messaggio è stato ricevuto. Ti risponderemo il più presto possibile.".replace(
    "{nome}",
    nomevisitatoreSalvato
  );
  const contenitore = document.getElementById("contatti-form");
  if (contenitore) {
    contenitore.innerHTML =
      '<div id="messaggio-successo"><h3>&#10004; ' +
      "Messaggio inviato" +
      "</h3><p>" +
      messaggioSuccesso +
      '</p><button id="button-nuovo-invio" onclick="location.reload()">' +
      "Invia un nuovo messaggio" +
      "</button></div>";
  }
}

if (formContatto) {
  formContatto.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // ho aggiunto un anti-bot "Honeypot" che lo controllo ora

    const honeypot = document.getElementById("website");
    if (honeypot && honeypot.value !== "") {
      formContatto.innerHTML = '<div id="messaggio-errore" style="color: red"><h3>' + "Invio non consentito per motivi di sicurezza." + "</h3>";
      return;
    }

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const messaggio = document.getElementById("messaggio");

    if (!nome || !email || !messaggio) return;

    let valido = true;

    rimuoviErrore(nome);
    rimuoviErrore(email);
    rimuoviErrore(messaggio);

    if (nome.value.trim().length < 2) {
      mostraErrore(nome, "Il nome è obbligatorio.");
      valido = false;
    }

    if (email.value.trim() === "") {
      mostraErrore(email, "L'email è obbligatoria.");
      valido = false;
    } else if (email.validity.typeMismatch || email.validity.patternMismatch) {
      mostraErrore(email, "Inserisci un indirizzo email valido.");
      valido = false;
    }

    if (messaggio.value.trim().length < 10) {
      mostraErrore(messaggio, "Il messaggio deve contenere almeno 10 caratteri.");
      valido = false;
    }

    if (!valido) {
      return;
    }

    nomevisitatoreSalvato = nome.value.trim();

    buttonInvia.innerHTML = "Invio in corso...";
    buttonInvia.disabled = true;

    // Simulo l'invio con un ritardo di rete

    setTimeout(function () {
      formInviato = true;
      mostraMessaggioSuccesso();
    }, 1500);
  });
}

// Scroll - ho scelto di farlo con Javascript e non con CSS (scroll-behavior: smooth;), perché così posso modficare l'animazione

function smoothScroll(destinazione, durata) {
  const inizio = window.scrollY;
  const distanza = destinazione - inizio;
  let tempoInizio = null;

  function animazione(tempoCorrente) {
    if (tempoInizio === null) tempoInizio = tempoCorrente;
    const tempoPassato = tempoCorrente - tempoInizio;
    const progresso = Math.min(tempoPassato / durata, 1);

    // Easing (lento-veloce-lento)
    const easing = progresso < 0.5 ? 2 * progresso * progresso : 1 - Math.pow(-2 * progresso + 2, 2) / 2;
    // Easing (veloce-lento)
    //const easing = 1 - Math.pow(1 - progresso, 3);
    window.scrollTo(0, inizio + distanza * easing);

    if (tempoPassato < durata) {
      requestAnimationFrame(animazione);
    }
  }
  requestAnimationFrame(animazione);
}

const linkInterni = document.querySelectorAll('a[href^="#"]');
linkInterni.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (href === "#" || href === "") return;

    const destinazione = document.querySelector(href);
    if (destinazione) {
      e.preventDefault();
      const offsetTop = destinazione.offsetTop - 80;
      smoothScroll(offsetTop, 1000);
    }
  });
});

// SCROLL Check - Controllo le sezioni così imposto la classe attiva al link corretto

const sezioni = document.querySelectorAll("section[id]");
const linkMenu = document.querySelectorAll("#menu-links a");

function aggiornaLinkAttivo() {
  // recupero la posizione corrente + offset per il menu (si aggiunge perché ho scelto di al menu una "poition: fixed" e copre circa 80px)
  const scrollY = window.scrollY + 90;

  sezioni.forEach(function (sezione) {
    const sezioneTop = sezione.offsetTop;
    const sezioneAltezza = sezione.offsetHeight;
    const sezioneId = sezione.getAttribute("id");

    // controlla quale sezione stimo guardando
    if (scrollY >= sezioneTop && scrollY < sezioneTop + sezioneAltezza) {
      linkMenu.forEach(function (link) {
        link.classList.remove("attivo");
      });

      const linkAttivo = document.querySelector('#menu-links a[href="#' + sezioneId + '"]');
      if (linkAttivo) {
        linkAttivo.classList.add("attivo");
      }
    }
  });
}

// questa parte del codice chiama la funzione "aggiornaLinkAttivo()" durante lo scrool e al caricamento
if (sezioni.length > 0 && linkMenu.length > 0) {
  window.addEventListener("scroll", aggiornaLinkAttivo);
  aggiornaLinkAttivo();
}

// Ho aggiunto un pulsante per tornare all'inzio della pagina

const buttonTornaSu = document.getElementById("torna-su");

if (buttonTornaSu) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      buttonTornaSu.classList.add("visibile");
    } else {
      buttonTornaSu.classList.remove("visibile");
    }
  });

  buttonTornaSu.addEventListener("click", function () {
    smoothScroll(0, 1000);
  });
}
