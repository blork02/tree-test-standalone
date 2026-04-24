(function () {
  'use strict';

  var app = document.getElementById('app');

  /* ── Session state ──────────────────────────────────────────────────────── */
  var lang          = null;
  var participantId = '';
  var seed          = 0;
  var taskOrder     = [];   // shuffled indices into CONFIG.tasks
  var currentStep   = 0;   // position in taskOrder (0-based)
  var taskResults   = [];
  var postStudyAnswers = null;

  /* ── Per-task state ─────────────────────────────────────────────────────── */
  var selectedNodeId   = null;
  var firstClickNodeId = null;
  var navLog           = [];
  var taskStartTime    = null;
  var selectedConfidence = null;
  var selectedEase       = null;
  var pendingResult      = null;
  var pathMap            = {};

  /* ── PRNG: seeded Fisher-Yates shuffle ──────────────────────────────────── */
  function seededShuffle(arr, s) {
    var a = arr.slice();
    var state = s >>> 0;
    function next() {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 4294967296;
    }
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(next() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* ── Path map: nodeId → [{id, label}, …] from tier-1 to node ───────────── */
  function buildPathMap(nodes, ancestors) {
    nodes.forEach(function (node) {
      var path = ancestors.concat({ id: node.id, label: node.label });
      pathMap[node.id] = path;
      if (node.children && node.children.length > 0) {
        buildPathMap(node.children, path);
      }
    });
  }

  /* ── i18n helper ────────────────────────────────────────────────────────── */
  function t(key) {
    return (CONFIG.i18n[lang] && CONFIG.i18n[lang][key]) || key;
  }

  /* ── XSS helper ─────────────────────────────────────────────────────────── */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pathString(nodeId) {
    var path = pathMap[nodeId];
    if (!path) return nodeId || '';
    return path.map(function (n) { return n.label || n.id; }).join(' › ');
  }

  function randomPID() {
    return 'P-' + Math.floor(1000 + Math.random() * 9000);
  }

  function progressPct(done, total) {
    return (done / total * 100).toFixed(1) + '%';
  }

  function progressHTML(done) {
    var total = CONFIG.tasks.length;
    var label = t('progressLabel')
      .replace('%d', String(done))
      .replace('%n', String(total));
    return (
      '<div class="progress-wrap">' +
        '<div class="progress-bar">' +
          '<div class="progress-fill" style="width:' + progressPct(done, total) + '"></div>' +
        '</div>' +
        '<div class="progress-label">' + esc(label) + '</div>' +
      '</div>'
    );
  }

  function scaleButtons(scaleId, onclickFn) {
    return (
      '<div class="confidence-scale" id="' + scaleId + '">' +
        [1, 2, 3, 4, 5].map(function (v) {
          return (
            '<button class="conf-btn" data-val="' + v + '" type="button"' +
            ' onclick="treeApp.' + onclickFn + '(' + v + ')">' + v + '</button>'
          );
        }).join('') +
      '</div>'
    );
  }

  /* ── Boot ───────────────────────────────────────────────────────────────── */
  function init() {
    var params    = new URLSearchParams(window.location.search);
    var paramLang = params.get('lang');

    if (paramLang === 'fr' || paramLang === 'nl') {
      setLang(paramLang);
      renderParticipantScreen();
    } else {
      renderLangSelector();
    }
  }

  function setLang(l) {
    lang = l;
    document.documentElement.lang = lang;
    pathMap = {};
    buildPathMap(CONFIG.trees[lang].children || [], []);
  }

  /* ── Screen: language selector ──────────────────────────────────────────── */
  function renderLangSelector() {
    app.innerHTML =
      '<div class="lang-selector">' +
        '<h1>HR Service Desk</h1>' +
        '<p class="lang-subtitle">Choisissez votre langue / Kies uw taal</p>' +
        '<div class="lang-buttons">' +
          '<button class="btn-lang" onclick="treeApp.selectLang(\'fr\')">Français</button>' +
          '<button class="btn-lang" onclick="treeApp.selectLang(\'nl\')">Nederlands</button>' +
        '</div>' +
      '</div>';
  }

  /* ── Screen: participant ID ─────────────────────────────────────────────── */
  function renderParticipantScreen() {
    var defaultPid = randomPID();
    app.innerHTML =
      '<div class="welcome-screen">' +
        '<div class="welcome-card">' +
          '<h1>' + esc(t('appTitle')) + '</h1>' +
          '<div class="field-group">' +
            '<label for="pid-input">' + esc(t('participantLabel')) + '</label>' +
            '<input type="text" id="pid-input" class="text-input"' +
            ' value="' + esc(defaultPid) + '" />' +
          '</div>' +
          '<button class="btn-primary" onclick="treeApp.submitParticipant()">' +
            esc(t('btnNext')) +
          '</button>' +
        '</div>' +
      '</div>';

    var input = document.getElementById('pid-input');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') window.treeApp.submitParticipant();
      });
    }
  }

  /* ── Screen: instructions ───────────────────────────────────────────────── */
  function renderInstructionsScreen() {
    app.innerHTML =
      '<div class="instructions-screen">' +
        '<div class="instructions-card">' +
          '<h2>' + esc(t('instructionsTitle')) + '</h2>' +
          '<div class="instructions-body">' + t('instructionsBodyHtml') + '</div>' +
          '<button class="btn-primary" onclick="treeApp.startSession()">' +
            esc(t('btnStart')) +
          '</button>' +
        '</div>' +
      '</div>';
  }

  /* ── Screen: task ───────────────────────────────────────────────────────── */
  function renderTaskScreen() {
    var taskIdx      = taskOrder[currentStep];
    var task         = CONFIG.tasks[taskIdx];
    var scenarioText = task['scenario_' + lang] || task.scenario_nl;
    var tree         = CONFIG.trees[lang];

    selectedNodeId   = null;
    firstClickNodeId = null;
    navLog           = [];
    selectedConfidence = null;
    taskStartTime    = Date.now();

    app.innerHTML =
      '<div class="task-page">' +
        '<header class="page-header">' +
          '<h1>' + esc(t('appTitle')) + '</h1>' +
          progressHTML(currentStep) +
        '</header>' +
        '<div class="scenario-box">' +
          '<div class="scenario-eyebrow">' + esc(t('scenarioLabel')) + '</div>' +
          '<p class="scenario-text">' + esc(scenarioText) + '</p>' +
        '</div>' +
        '<div class="tree-section">' +
          '<h2 class="tree-label">' + esc(t('treeLabel')) + '</h2>' +
          renderTreeHTML(tree.children || [], 0) +
        '</div>' +
        '<div class="breadcrumb-section">' +
          '<span class="breadcrumb-label">' + esc(t('breadcrumbLabel')) + '</span> ' +
          '<span class="breadcrumb-path" id="breadcrumb">' + esc(t('breadcrumbEmpty')) + '</span>' +
        '</div>' +
        '<button class="btn-confirm" id="confirm-btn" disabled' +
            ' onclick="treeApp.handleConfirm()">' +
          esc(t('confirmBtn')) +
        '</button>' +
      '</div>';

    attachTreeListeners();
  }

  /* ── Tree HTML ──────────────────────────────────────────────────────────── */
  function renderTreeHTML(nodes, depth) {
    if (!nodes || nodes.length === 0) return '';
    var cls  = depth === 0 ? 'tree-root' : 'tree-children';
    var html = '<ul class="' + cls + '">';
    nodes.forEach(function (node) {
      var isLeaf = !node.children || node.children.length === 0;
      var label  = node.label !== undefined ? node.label : node.id;
      if (isLeaf) {
        html +=
          '<li class="leaf">' +
            '<button class="tree-leaf" data-id="' + esc(node.id) + '" type="button">' +
              esc(label) +
            '</button>' +
          '</li>';
      } else {
        html +=
          '<li class="has-children">' +
            '<button class="tree-parent" data-id="' + esc(node.id) + '" type="button">' +
              esc(label) +
            '</button>' +
            renderTreeHTML(node.children, depth + 1) +
          '</li>';
      }
    });
    html += '</ul>';
    return html;
  }

  function attachTreeListeners() {
    document.querySelectorAll('.tree-parent').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var li = btn.closest('li.has-children');
        if (li) {
          var expanding = !li.classList.contains('open');
          li.classList.toggle('open');
          if (expanding) {
            navLog.push({ type: 'open', pathStr: pathString(btn.dataset.id) });
          }
        }
      });
    });

    document.querySelectorAll('.tree-leaf').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        selectLeaf(btn.dataset.id);
      });
    });
  }

  /* ── Leaf selection ─────────────────────────────────────────────────────── */
  function selectLeaf(nodeId) {
    document.querySelectorAll('.tree-leaf.selected').forEach(function (el) {
      el.classList.remove('selected');
    });

    if (selectedNodeId === nodeId) {
      selectedNodeId = null;
      updateBreadcrumb(null);
      document.getElementById('confirm-btn').disabled = true;
    } else {
      if (!firstClickNodeId) firstClickNodeId = nodeId;
      selectedNodeId = nodeId;
      var el = document.querySelector('.tree-leaf[data-id="' + nodeId + '"]');
      if (el) el.classList.add('selected');
      updateBreadcrumb(nodeId);
      document.getElementById('confirm-btn').disabled = false;
      navLog.push({ type: 'select', nodeId: nodeId, pathStr: pathString(nodeId) });
    }
  }

  function updateBreadcrumb(nodeId) {
    var el = document.getElementById('breadcrumb');
    if (!el) return;
    if (!nodeId) {
      el.textContent = t('breadcrumbEmpty');
      el.classList.remove('has-selection');
    } else {
      el.textContent = pathString(nodeId);
      el.classList.add('has-selection');
    }
  }

  /* ── Screen: post-task (confidence + comment) ───────────────────────────── */
  function renderPostTaskScreen() {
    var isLast    = currentStep === CONFIG.tasks.length - 1;
    var nextLabel = isLast ? t('btnFinish') : t('btnNextTask');

    app.innerHTML =
      '<div class="task-page">' +
        '<header class="page-header">' +
          '<h1>' + esc(t('appTitle')) + '</h1>' +
          progressHTML(currentStep + 1) +
        '</header>' +
        '<div class="confirmed-box">' +
          '<div class="confirmed-checkmark" aria-hidden="true">✓</div>' +
          '<div class="confirmed-path">' + esc(pathString(pendingResult.finalAnswer)) + '</div>' +
        '</div>' +
        '<div class="post-task-card">' +
          '<p class="q-label">' + esc(t('confidenceQ')) + '</p>' +
          scaleButtons('conf-scale', 'selectConfidence') +
          '<div class="scale-anchors">' +
            '<span>' + esc(t('confidenceLow')) + '</span>' +
            '<span>' + esc(t('confidenceHigh')) + '</span>' +
          '</div>' +
          '<div class="comment-group">' +
            '<label class="q-label" for="task-comment">' + esc(t('commentQ')) + '</label>' +
            '<textarea id="task-comment" class="text-area" rows="3"></textarea>' +
          '</div>' +
          '<button class="btn-primary" id="btn-next-task" disabled' +
              ' onclick="treeApp.submitPostTask()">' +
            esc(nextLabel) +
          '</button>' +
        '</div>' +
      '</div>';
  }

  /* ── Screen: post-study questionnaire ──────────────────────────────────── */
  function renderPostStudyScreen() {
    var topCategories = CONFIG.trees[lang].children || [];
    var checkboxes = topCategories.map(function (node) {
      return (
        '<label class="checkbox-item">' +
          '<input type="checkbox" class="hardest-check" value="' + esc(node.id) + '" />' +
          esc(node.label) +
        '</label>'
      );
    }).join('');

    app.innerHTML =
      '<div class="post-study-screen">' +
        '<div class="post-study-card">' +
          '<h2>' + esc(t('postStudyTitle')) + '</h2>' +

          '<div class="question-group">' +
            '<p class="q-label">' + esc(t('easeQ')) + '</p>' +
            scaleButtons('ease-scale', 'selectEase') +
            '<div class="scale-anchors">' +
              '<span>' + esc(t('easeLow')) + '</span>' +
              '<span>' + esc(t('easeHigh')) + '</span>' +
            '</div>' +
          '</div>' +

          '<div class="question-group">' +
            '<p class="q-label">' + esc(t('hardestQ')) + '</p>' +
            '<div class="checkbox-group">' + checkboxes + '</div>' +
          '</div>' +

          '<div class="question-group">' +
            '<label class="q-label" for="ps-missing">' + esc(t('missingQ')) + '</label>' +
            '<textarea id="ps-missing" class="text-area" rows="3"></textarea>' +
          '</div>' +

          '<div class="question-group">' +
            '<label class="q-label" for="ps-other">' + esc(t('otherCommentsQ')) + '</label>' +
            '<textarea id="ps-other" class="text-area" rows="3"></textarea>' +
          '</div>' +

          '<button class="btn-primary" onclick="treeApp.submitPostStudy()">' +
            esc(t('btnSubmitPostStudy')) +
          '</button>' +
        '</div>' +
      '</div>';
  }

  /* ── Screen: download ───────────────────────────────────────────────────── */
  function renderDownloadScreen() {
    app.innerHTML =
      '<div class="download-screen">' +
        '<div class="download-card">' +
          '<div class="dl-checkmark" aria-hidden="true">✓</div>' +
          '<h2>' + esc(t('thankyouTitle')) + '</h2>' +
          '<p class="dl-body">' + esc(t('thankyouBody')) + '</p>' +
          '<button class="btn-download" onclick="treeApp.downloadCSV()">' +
            esc(t('btnDownload')) +
          '</button>' +
        '</div>' +
      '</div>';
  }

  /* ── CSV generation ─────────────────────────────────────────────────────── */
  function csvCell(val) {
    var s = String(val == null ? '' : val);
    if (s.search(/[,"\r\n]/) !== -1) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function generateCSV() {
    var cols = [
      'participant_id', 'language', 'task_id', 'task_order', 'scenario_text',
      'path_taken', 'first_click', 'first_click_correct', 'final_answer',
      'final_answer_path', 'correct', 'time_seconds', 'confidence', 'comment',
      'randomisation_seed'
    ];
    var rows = [cols.join(',')];

    taskResults.forEach(function (r) {
      var task      = CONFIG.tasks[r.taskIdx];
      var correctId = task['correct_' + lang];
      var row = [
        participantId,
        lang,
        task.id,
        r.taskOrder,
        task['scenario_' + lang],
        r.pathTaken,
        r.firstClick,
        r.firstClick !== '' ? String(r.firstClick === correctId) : '',
        r.finalAnswer,
        r.finalAnswerPath,
        String(r.finalAnswer === correctId),
        r.timeSeconds,
        r.confidence != null ? r.confidence : '',
        r.comment,
        seed
      ];
      rows.push(row.map(csvCell).join(','));
    });

    if (postStudyAnswers) {
      var psRow = [
        participantId, lang, 'post_study', '', '', '', '', '', '', '', '',
        postStudyAnswers.ease != null ? postStudyAnswers.ease : '',
        JSON.stringify(postStudyAnswers),
        seed
      ];
      rows.push(psRow.map(csvCell).join(','));
    }

    return rows.join('\r\n');
  }

  /* ── Public API ─────────────────────────────────────────────────────────── */
  window.treeApp = {

    selectLang: function (selectedLang) {
      setLang(selectedLang);
      renderParticipantScreen();
    },

    submitParticipant: function () {
      var input = document.getElementById('pid-input');
      participantId = (input ? input.value.trim() : '') || randomPID();
      renderInstructionsScreen();
    },

    startSession: function () {
      seed      = Date.now() & 0x7fffffff;
      var idxs  = CONFIG.tasks.map(function (_, i) { return i; });
      taskOrder = seededShuffle(idxs, seed);
      currentStep  = 0;
      taskResults  = [];
      pendingResult = null;
      renderTaskScreen();
    },

    handleConfirm: function () {
      if (!selectedNodeId) return;
      var elapsed = Math.round((Date.now() - taskStartTime) / 1000);
      var pathTaken = navLog.map(function (e) {
        return (e.type === 'open' ? '▸ ' : '○ ') + e.pathStr;
      }).join(' | ');

      pendingResult = {
        taskIdx:       taskOrder[currentStep],
        taskOrder:     currentStep + 1,
        firstClick:    firstClickNodeId || '',
        finalAnswer:   selectedNodeId,
        finalAnswerPath: pathString(selectedNodeId),
        pathTaken:     pathTaken,
        timeSeconds:   elapsed,
        confidence:    null,
        comment:       ''
      };
      renderPostTaskScreen();
    },

    selectConfidence: function (val) {
      selectedConfidence = val;
      document.querySelectorAll('#conf-scale .conf-btn').forEach(function (btn) {
        btn.classList.toggle('selected', +btn.dataset.val === val);
      });
      var next = document.getElementById('btn-next-task');
      if (next) next.disabled = false;
    },

    submitPostTask: function () {
      var comment = document.getElementById('task-comment');
      pendingResult.confidence = selectedConfidence;
      pendingResult.comment    = comment ? comment.value.trim() : '';
      taskResults.push(pendingResult);
      pendingResult = null;
      selectedConfidence = null;
      currentStep++;

      if (currentStep >= CONFIG.tasks.length) {
        renderPostStudyScreen();
      } else {
        renderTaskScreen();
      }
    },

    selectEase: function (val) {
      selectedEase = val;
      document.querySelectorAll('#ease-scale .conf-btn').forEach(function (btn) {
        btn.classList.toggle('selected', +btn.dataset.val === val);
      });
    },

    submitPostStudy: function () {
      var hardest = [];
      document.querySelectorAll('.hardest-check:checked').forEach(function (cb) {
        hardest.push(cb.value);
      });
      var missing = document.getElementById('ps-missing');
      var other   = document.getElementById('ps-other');
      postStudyAnswers = {
        ease:                selectedEase,
        hardestCategories:   hardest,
        missingOrPoorlyNamed: missing ? missing.value.trim() : '',
        otherComments:       other   ? other.value.trim()   : ''
      };
      renderDownloadScreen();
    },

    downloadCSV: function () {
      var csv  = generateCSV();
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      var date = new Date().toISOString().slice(0, 10);
      a.href     = url;
      a.download = 'tree-test-' + participantId + '-' + date + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
