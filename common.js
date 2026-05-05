// ===== STATE =====
    let xp = 0;
    let acertos = 0;
    let fasesCompletas = 0;
    const phasesDone = { 1: false, 2: false, 25: false, 3: false, 4: false };

    // ===== STAR RATING =====
    const starRatings = {};
    function rateStar(groupId, val) {
        starRatings[groupId] = val;
        const group = document.getElementById(groupId);
        if (!group) return;
        group.querySelectorAll('.star-btn').forEach(btn => {
            const bval = parseInt(btn.dataset.val);
            btn.style.color = bval <= val ? '#ffd700' : 'var(--text-muted)';
            btn.style.background = bval <= val ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)';
            btn.style.borderColor = bval <= val ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.15)';
        });
    }

    // ===== LAB REPORT =====
    function submitLabReport() {
        const gfnVerdict = document.getElementById('gfn-verdict').value;
        const xboxVerdict = document.getElementById('xbox-verdict').value;
        const result = document.getElementById('lab-result');
        if (!gfnVerdict && !xboxVerdict) {
            result.style.display = 'block';
            result.style.color = 'var(--neon-orange)';
            result.textContent = '// Preencha pelo menos o veredicto de uma plataforma antes de registrar.';
            return;
        }
        addXP(50);
        acertos++;
        document.getElementById('acertosDisplay').textContent = acertos;
        result.style.display = 'block';
        result.style.color = 'var(--neon-green)';
        result.innerHTML = '// ✅ Lab Report registrado! +50 XP · Use esses dados na Fase 4 — Missão M1.';
        showToast('🔬', 'Lab Report!', '+50 XP · Dados registrados para a Missão Final!', true);
    }

    // Match game state
    let matchSelected = { left: null, right: null };
    const correctPairs = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' };
    const matchedPairs = {};

    // ===== XP SYSTEM =====
    function addXP(amount) {
        xp = Math.min(1200, xp + amount);
        document.getElementById('xpDisplay').textContent = xp;
        document.getElementById('xpFill').style.width = (xp / 1200 * 100) + '%';
    }

    function showToast(icon, title, msg, isGold = false) {
        const t = document.getElementById('toast');
        t.style.borderColor = isGold ? 'var(--gold)' : 'var(--neon-green)';
        document.getElementById('toastIcon').textContent = icon;
        document.getElementById('toastTitle').textContent = title;
        document.getElementById('toastMsg').textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }

    // ===== CONCEPTS =====
    const conceptsOpened = new Set();
    function revealConcept(trigger, id) {
        const body = document.getElementById(id);
        const isOpen = trigger.classList.contains('open');
        trigger.classList.toggle('open', !isOpen);
        body.classList.toggle('open', !isOpen);

        if (!conceptsOpened.has(id)) {
            conceptsOpened.add(id);
            addXP(10);
        }
    }

    // ===== PHASE COMPLETE =====
    function completePhase(phase, xpAmt) {
        if (phasesDone[phase]) return;
        phasesDone[phase] = true;
        fasesCompletas++;
        document.getElementById('fasesDisplay').textContent = fasesCompletas + '/5';
        addXP(xpAmt);

        const cp = document.getElementById('cp' + phase);
        if (cp) { cp.classList.add('done'); }

        const icons = ['🧠','🎬','🖥️','⚔️','🚀'];
        const titles = ['Fase 1 Completa!','Fase 2 Completa!','Lab Completo!','Fase 3 Completa!','SEMANA COMPLETA!'];
        const msgs = ['+200 XP · Conceitos dominados','+ 150 XP · Recon concluída','+150 XP · Plataformas testadas!','+450 XP · Arenas vencidas','🏆 Você dominou Cloud Gaming!'];
        const phaseIndex = { 1:0, 2:1, 25:2, 3:3, 4:4 };
        const idx = phaseIndex[phase] ?? 0;
        const isGold = phase === 4;
        showToast(icons[idx], titles[idx], msgs[idx], isGold);
    }

    // ===== QUIZ =====
    const feedbackTexts = {
        'q1': { correct: '✅ Exato! Sem GPU potente local, você acessa jogos pesados via servidor remoto.', wrong: '❌ Não. A grande vantagem é rodar jogos pesados sem hardware local poderoso.' },
        'q2': { correct: '✅ Correto! FPS competitivo exige reação em milissegundos — latência alta arruína completamente.', wrong: '❌ FPS competitivo é o gênero mais sensível à latência. RPG de turno quase não sente.' },
        'q3': { correct: '✅ Exato! GeForce Now é único por usar sua biblioteca já comprada no Steam e Epic Games.', wrong: '❌ A diferença chave: GeForce Now usa sua biblioteca Steam/Epic — não cobra por novo catálogo.' },
        'q4': { correct: '✅ Perfeito! H.264, H.265 e AV1 são os codecs que comprimem e transmitem os frames do jogo.', wrong: '❌ São os codecs de vídeo (H.264/H.265/AV1) que fazem a compressão e transmissão do stream.' },
        'q5': { correct: '✅ Correto! Mecânicas frame-perfect são impossíveis com latência de rede — o timing fica injusto.', wrong: '❌ O principal problema são mecânicas frame-perfect — o timing é destruído pela latência.' },
        'q6': { correct: '✅ Exato! O Flight Simulator usa Azure para processar o terreno do mundo inteiro — tecnicamente impossível localmente.', wrong: '❌ O diferencial é processar os dados geográficos do planeta inteiro nos servidores Azure — impossível local.' },
    };

    function answer(btn, qId, result) {
        const container = document.getElementById(qId);
        if (container.querySelector('.correct') || container.querySelector('.disabled')) return;

        const allBtns = container.querySelectorAll('.quiz-option');
        allBtns.forEach(b => b.classList.add('disabled'));
        btn.classList.add(result);

        const fb = document.getElementById(qId + '-fb');
        fb.textContent = feedbackTexts[qId][result];
        fb.className = 'quiz-feedback ' + result;

        if (result === 'correct') {
            addXP(50);
            acertos++;
            document.getElementById('acertosDisplay').textContent = acertos;
            showToast('⚡', '+50 XP', 'Resposta correta!');
        } else {
            showToast('💀', 'Errou!', feedbackTexts[qId].wrong.substring(2, 60) + '...');
        }
    }

    // ===== BLANKS =====
    const blankAnswers = ['latencia', 'av1', 'servidor', 'geforce now', 'tolerancia'];
    function checkBlanks() {
        let correct = 0;
        const result = document.getElementById('blanks-result');
        blankAnswers.forEach((ans, i) => {
            const inp = document.getElementById('b' + (i+1));
            const val = inp.value.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
            const ansNorm = ans.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
            if (val === ansNorm || ans.includes(val) && val.length > 3) {
                inp.className = 'blank-input correct';
                correct++;
            } else {
                inp.className = 'blank-input wrong';
            }
        });
        const xpEarned = correct * 30;
        addXP(xpEarned);
        acertos += correct;
        document.getElementById('acertosDisplay').textContent = acertos;
        result.style.display = 'block';
        result.style.color = correct >= 4 ? 'var(--neon-green)' : 'var(--neon-orange)';
        result.innerHTML = `// ${correct}/5 corretos · +${xpEarned} XP ${correct >= 4 ? '🏆 EXCELENTE!' : correct >= 2 ? '👍 Continue!' : '💀 Revise os conceitos'}`;
        showToast('📝', `${correct}/5 Corretos`, `+${xpEarned} XP nas lacunas`);
    }

    // ===== MATCH GAME =====
    function selectMatch(el, side) {
        const id = el.dataset.id;
        if (matchedPairs[id] || el.style.opacity === '0.4') return;

        // Deselect previous
        document.querySelectorAll('#match-' + side + ' .match-item').forEach(m => {
            if (!matchedPairs[m.dataset.id]) m.style.background = '';
        });

        matchSelected[side] = id;
        el.style.background = 'rgba(0,245,255,0.1)';
        el.style.borderColor = 'var(--neon-cyan)';

        // Try pair
        if (matchSelected.left && matchSelected.right) {
            const leftId = matchSelected.left;
            const rightId = matchSelected.right;
            setTimeout(() => tryPair(leftId, rightId), 200);
        }
    }

    function tryPair(leftId, rightId) {
        const leftEl = document.querySelector(`#match-left [data-id="${leftId}"]`);
        const rightEl = document.querySelector(`#match-right [data-id="${rightId}"]`);

        if (correctPairs[leftId] === rightId) {
            // Correct
            [leftEl, rightEl].forEach(el => {
                el.style.background = 'rgba(0,255,136,0.1)';
                el.style.borderColor = 'var(--neon-green)';
                el.style.color = 'var(--neon-green)';
                el.style.cursor = 'default';
                el.onclick = null;
            });
            matchedPairs[leftId] = rightId;
            addXP(22);
            acertos++;
            document.getElementById('acertosDisplay').textContent = acertos;

            if (Object.keys(matchedPairs).length === 4) {
                const fb = document.getElementById('match-feedback');
                fb.style.display = 'block';
                fb.innerHTML = '<div style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);padding:15px 20px;border-radius:8px;color:var(--neon-green);font-family:Share Tech Mono,monospace;">// ✅ TODOS OS PARES CORRETOS! +90 XP · Você dominou o mercado de cloud gaming.</div>';
                showToast('🎯', 'Match Perfeito!', '+90 XP · Todos os pares corretos!', true);
            }
        } else {
            // Wrong
            [leftEl, rightEl].forEach(el => {
                el.style.background = 'rgba(255,0,85,0.1)';
                el.style.borderColor = 'var(--neon-red)';
            });
            setTimeout(() => {
                [leftEl, rightEl].forEach(el => {
                    el.style.background = '';
                    el.style.borderColor = '';
                });
            }, 800);
        }

        matchSelected = { left: null, right: null };
    }

    function checkMatch() {
        const done = Object.keys(matchedPairs).length;
        document.getElementById('match-score').textContent = done + '/4 pares corretos';
    }

    // ===== SCROLL TO PHASE =====
    function scrollToPhase(n) {
        const el = document.getElementById('phase' + n);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
