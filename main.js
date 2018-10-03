/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Brandon Sara (http://bsara.github.io/)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



;(function() {
  let $_branchName;
  let $_commitAuthor;
  let $_commitMsg;
  let $_currentBranch;
  let $_tagName;

  let _config;
  let _graph;

  let _branches = {};


  document.addEventListener('DOMContentLoaded', function() {
    $_branchName    = document.querySelector('#branchName');
    $_commitAuthor  = document.querySelector('#commitAuthor');
    $_commitMsg     = document.querySelector('#commitMsg');
    $_currentBranch = document.querySelector('#currentBranch');
    $_tagName       = document.querySelector('#tagName');
    $_mergeTarget   = document.querySelector('#mergeTargetBranch');

    const defaultCommitMessage = 'This is an automated commit message.';
    const mergeTargetsHint = '<option disabled>Branch to merge</option>';

    _config = {
      author:      $_commitAuthor.value,
      orientation: 'vertical',
      mode:        'compact',

      template: {
        colors: [
          "#07f", "#2ecc71", "#fe4a49", "#fed766", "#af42ae",
          "#af9164", "#32292f", "#cb8589", "#cbc5ea"
        ],
        branch: {
          lineWidth: 10,
          spacingX:  50
        },
        commit: {
          spacingY: -80,
          dot: {
            color:       '#f8f8f8',
            size:        10,
            strokeWidth: 10
          },
          message: {
            displayAuthor: true,
            displayBranch: true,
            displayHash:   true,
            font:          'normal 12pt sans'
          },
          shouldDisplayTooltipsInCompactMode: true,
          tooltipHTMLFormatter: (commit => `<b>[${commit.branch.name}] ${commit.sha1}</b>: ${commit.message}`)
        }
      }
    };

    _graph = new GitGraph(_config);
    _branch(_graph, 'master');
    _commit(_branches.master, "Initial commit");
    _commit(_branches.master, "Second commit");

    document.querySelector('#currentBranch option[value="master"]')._branch = _graph.branches[0];

    $_currentBranch.addEventListener('change', () => {
      $_currentBranch.selectedOptions[0]._branch.checkout();

      const selectedBranchName = $_currentBranch.selectedOptions[0]._branch.name;
      const possibleMergeTargets = _graph.branches.filter((branch) => {return branch.name !== selectedBranchName});
      $_mergeTarget.innerHTML = mergeTargetsHint;
      possibleMergeTargets.forEach((branch) => {
        $_mergeTarget.appendChild(_createBranchOption(branch));
      });
    });


    document.querySelector('#createBranchButton').addEventListener('click', () => {
      if($_branchName.value === ''){
        return;
      }
      const newBranch = _branch(_graph, $_branchName.value);
      $_branchName.value = '';
      $_currentBranch.appendChild(_createBranchOption(newBranch));
      $_currentBranch.value = newBranch.name;
      
      const possibleMergeTargets = _graph.branches.filter((branch) => {return branch.name !== newBranch.name});
      $_mergeTarget.innerHTML = mergeTargetsHint;
      possibleMergeTargets.forEach((branch) => {
        $_mergeTarget.appendChild(_createBranchOption(branch));
      });
    });

    document.querySelector('#mergeButton').addEventListener('click', () => {
      const sourceBranch = _graph.branches.filter((branch) => {return branch.name === $_mergeTarget.value})[0];
      const targetBranch = _graph.branches.filter((branch) => {return branch.name === $_currentBranch.value})[0];
      if(sourceBranch === undefined || targetBranch === undefined){
        return;
      }
      sourceBranch.merge(targetBranch, ($_commitMsg.value || defaultCommitMessage));
    });

    document.querySelector('#commitButton').addEventListener('click', () => {
      _commit(_graph, ($_commitMsg.value || defaultCommitMessage), $_commitAuthor.value);
      $_commitMsg.value = '';
    });
  });

  function _branch(parentBranch, name) {
    if (Object.keys(_branches).includes(name)) {
      return undefined;
    }

    _branches[name] = parentBranch.branch(name);

    return _branches[name];
  }


  function _endBranch(branch) {
    return branch.delete();
  }

  function _commit(branch, message, author) {
    return branch.commit({
      message: message,
      author,
      onClick: _onClickCommit
    });
  }

  function _tag(commit) {
    // TODO: Implement
  }

  function _onClickCommit(commit) {
    // TODO: Implement
  }


  function _onClickBranch(branch) {
    // TODO: Implement
    console.log('hit _onClickBranch!');
  }

  function _createBranchOption(branch) {
    const $branchOption = document.createElement('option');
    $branchOption._branch = branch;
    $branchOption.value = branch.name;
    $branchOption.innerText = branch.name;
    return $branchOption;
  }

})();

