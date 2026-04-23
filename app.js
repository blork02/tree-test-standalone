(function () {
  'use strict';

  var app = document.getElementById('app');

  var lang = null;
  var selectedNodeId = null;
  var pathMap = {};
  var navLog = []; // [{type:'open'|'select', pathStr, nodeId?}]

  /* ── Boot ───────────────────────────────────────────────────────────────── */
  function init() {
    var params = new URLSearchParams(window.location.search);
    var paramLang = params.get('lang');

    if (paramLang === 'fr' || paramLang === 'nl') {
      lang = paramLang;
    }

    if (!lang) {
      renderLangSelector();
      return;
    }

    var tree = CONFIG.trees[lang];
    buildPathMap(tree.children || [], []);
    renderTask(tree);
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
    if (!path) return nodeId;
    return path.map(function (n) { return n.label || n.id; }).join(' › ');
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

  /* ── Screen: tree + breadcrumb + confirm ────────────────────────────────── */
  function renderTask(tree) {
    app.innerHTML =
      '<div class="task-page">' +
        '<header class="page-header"><h1>' + esc(t('appTitle')) + '</h1></header>' +
        '<div class="tree-section">' +
          '<h2 class="tree-label">' + esc(t('treeLabel')) + '</h2>' +
          renderTreeHTML(tree.children || [], 0) +
        '</div>' +
        '<div class="breadcrumb-section">' +
          '<span class="breadcrumb-label">' + esc(t('breadcrumbLabel')) + '</span> ' +
          '<span class="breadcrumb-path" id="breadcrumb">' + esc(t('breadcrumbEmpty')) + '</span>' +
        '</div>' +
        '<button class="btn-confirm" id="confirm-btn" disabled ' +
            'onclick="treeApp.handleConfirm()">' +
          esc(t('confirmBtn')) +
        '</button>' +
      '</div>';

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

  /* ── Tree HTML ──────────────────────────────────────────────────────────── */
  function renderTreeHTML(nodes, depth) {
    if (!nodes || nodes.length === 0) return '';
    var cls = depth === 0 ? 'tree-root' : 'tree-children';
    var html = '<ul class="' + cls + '">';
    nodes.forEach(function (node) {
      var isLeaf = !node.children || node.children.length === 0;
      var label = node.label !== undefined ? node.label : node.id;
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

  /* ── Leaf selection ─────────────────────────────────────────────────────── */
  function selectLeaf(nodeId) {
    document.querySelectorAll('.tree-leaf.selected').forEach(function (el) {
      el.classList.remove('selected');
    });

    if (selectedNodeId === nodeId) {
      // Toggle off — don't log, just clear
      selectedNodeId = null;
      updateBreadcrumb(null);
      document.getElementById('confirm-btn').disabled = true;
    } else {
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

  /* ── Screen: confirmed — confirmed path + nav log + Lookback reminder ───── */
  function renderConfirmed() {
    var confirmedPath = pathString(selectedNodeId);

    // Find the last 'select' entry to mark as confirmed
    var lastSelectIndex = -1;
    navLog.forEach(function (entry, i) {
      if (entry.type === 'select') lastSelectIndex = i;
    });

    var logHtml = navLog.map(function (entry, i) {
      if (entry.type === 'open') {
        return (
          '<div class="nav-entry nav-open">' +
            '<span class="nav-icon" aria-hidden="true">▸</span>' +
            '<span class="nav-text">' + esc(entry.pathStr) + '</span>' +
          '</div>'
        );
      }
      var isConfirmed = (i === lastSelectIndex);
      return (
        '<div class="nav-entry ' + (isConfirmed ? 'nav-confirmed-entry' : 'nav-select') + '">' +
          '<span class="nav-icon" aria-hidden="true">' + (isConfirmed ? '✓' : '○') + '</span>' +
          '<span class="nav-text">' + esc(entry.pathStr) + '</span>' +
        '</div>'
      );
    }).join('');

    app.innerHTML =
      '<div class="task-page">' +
        '<header class="page-header"><h1>' + esc(t('appTitle')) + '</h1></header>' +

        /* Confirmed answer — full width, always above the fold */
        '<div class="confirmed-box">' +
          '<div class="confirmed-checkmark" aria-hidden="true">✓</div>' +
          '<div class="confirmed-path">' + esc(confirmedPath) + '</div>' +
        '</div>' +

        /* Two columns: nav log (left) + Lookback reminder (right) */
        '<div class="confirmed-columns">' +
          '<div class="confirmed-col-log">' +
            '<div class="nav-log">' +
              '<h3 class="nav-log-title">' + esc(t('navLogTitle')) + '</h3>' +
              logHtml +
            '</div>' +
          '</div>' +
          '<div class="confirmed-col-reminder">' +
            '<div class="reminder-box">' +
              '<div class="reminder-title">' + esc(t('reminderTitle')) + '</div>' +
              '<p class="reminder-intro">' + esc(t('reminderIntro')) + '</p>' +
              '<ol class="reminder-questions">' +
                '<li>' + esc(t('reminderQ1')) + '</li>' +
                '<li>' + esc(t('reminderQ2')) + '</li>' +
              '</ol>' +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>';
  }

  /* ── Public API ─────────────────────────────────────────────────────────── */
  window.treeApp = {
    selectLang: function (selectedLang) {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', selectedLang);
      window.location.href = url.toString();
    },
    handleConfirm: function () {
      if (!selectedNodeId) return;
      renderConfirmed();
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
