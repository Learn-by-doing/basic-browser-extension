(function() {

	// This function finds and replaces text (can be a regular expression).
	var findAndReplace = function(searchText, replacement, searchNode) {

		if (!searchText) {
			throw Error('Search text is required.');
		}

		if (!replacement) {
			throw Error('Replacement is required.');
		}

		var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText;
		var childNodes = (searchNode || document.body).childNodes;
		var cnLength = childNodes.length;
		var excludes = 'html,head,style,title,link,meta,script,object,iframe';

		while (cnLength--) {

			var currentNode = childNodes[cnLength];

			if (
				currentNode.nodeType === 1 &&
				(excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1
			) {
				arguments.callee(searchText, replacement, currentNode);
			}

			if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
				continue;
			}

			var parent = currentNode.parentNode;
			var fragment = (function() {

				var html = currentNode.data.replace(regex, replacement);
				var wrap = document.createElement('div');
				var fragment = document.createDocumentFragment();

				wrap.innerHTML = html;

				while (wrap.firstChild) {
					fragment.appendChild(wrap.firstChild);
				}

				return fragment;

			})();

			parent.insertBefore(fragment, currentNode);
			parent.removeChild(currentNode);
		}
	};

	// Find and replace all instances of the word "zeman".
	findAndReplace(/(zeman)/gi, '<span style="display: inline-block; transform: scaleX(-1)">$1</span>', document.body);

})();

