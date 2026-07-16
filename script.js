    const menuButton = document.querySelector('[data-menu-button]');
    const menuPanel = document.querySelector('[data-menu-panel]');
    const header = document.querySelector('[data-header]');
    const projectTrack = document.querySelector('[data-project-track]');
    const projectPrev = document.querySelector('[data-project-prev]');
    const projectNext = document.querySelector('[data-project-next]');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const abstractShapes = Array.from(document.querySelectorAll('[data-abstract-shape]'));
    const projectTitles = ['AppÁgil', 'Código e Conteúdo', 'Em breve'];
    const projectSlides = Array.from(projectTrack.children);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canUseCursorEffect = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion;
    let projectIndex = 0;

    const setMenuState = (open) => {
      menuButton.setAttribute('aria-expanded', String(open));
      menuPanel.dataset.open = open ? 'true' : 'false';
      menuPanel.setAttribute('aria-hidden', String(!open));
    };

    const setHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuPanel.dataset.open === 'true';
      setMenuState(!isOpen);
    });

    menuPanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
      if (!menuPanel.contains(event.target) && !menuButton.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuState(false);
      }
    });

    window.addEventListener('scroll', setHeaderState, { passive: true });
    setHeaderState();

    const renderProject = (index, animate = true) => {
      const count = projectSlides.length || 1;
      projectIndex = ((index % count) + count) % count;
      projectTrack.style.transitionDuration = animate ? '420ms' : '0ms';
      projectTrack.style.transform = `translate3d(${-projectIndex * 100}%, 0, 0)`;
    };

    projectPrev.addEventListener('click', () => renderProject(projectIndex - 1));
    projectNext.addEventListener('click', () => renderProject(projectIndex + 1));
    window.addEventListener('resize', () => renderProject(projectIndex, false), { passive: true });
    renderProject(0, false);

    const updateAbstractMotion = (clientX, clientY) => {
      const normalizedX = clientX / window.innerWidth - 0.5;
      const normalizedY = clientY / window.innerHeight - 0.5;

      abstractShapes.forEach((shape, index) => {
        const depth = index + 1;
        const moveX = normalizedX * 22 * depth;
        const moveY = normalizedY * 18 * depth;
        const rotation = normalizedX * 12 * depth;
        shape.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotation}deg)`;
      });
    };

    if (canUseCursorEffect && cursorDot && cursorRing) {
      document.body.classList.add('cursor-active');
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;
      let rafId = null;

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;

        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        rafId = window.requestAnimationFrame(animateCursor);
      };

      document.addEventListener('pointermove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        updateAbstractMotion(mouseX, mouseY);
        if (rafId === null) {
          animateCursor();
        }
      }, { passive: true });

      document.addEventListener('pointerleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
      });
      document.addEventListener('pointerenter', () => {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      });
    } else {
      document.addEventListener('pointermove', (event) => {
        updateAbstractMotion(event.clientX, event.clientY);
      }, { passive: true });
    }

    if (abstractShapes.length) {
      updateAbstractMotion(window.innerWidth / 2, window.innerHeight / 2);
    }
  