/**
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * Mail
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

define(function(require) {
	'use strict';

	var MessageCollection = require('models/messagecollection');

	var UnifiedMessageCollection = MessageCollection.extend({

		/**
		 * Kinda hacky, but we have to prevent Backbone from merging
		 * messages of different folders …
		 */
		idAttribute: 'hash',

		/**
		 * @param {Folder} folder
		 * @param {int} id
		 * @returns {null|Message}
		 */
		getByFolderAndId: function(folder, id) {
			return MessageCollection.prototype.get.apply(this, id + folder.get('cid'));
		},

		/**
		 * This method must not be used on this special collection
		 * @returns {undefined}
		 */
		get: function() {
			throw new Error('Not allowed, use getByFolderAndId instead');
		},

		add: function(message, folder) {
			if (!folder) {
				throw new Error('Unified message collection requires a folder when adding');
			}
			var hash = '' + message.id + folder.cid;
			if (!!message.set) {
				message.set('hash', hash);
			} else {
				message.hash = hash;
			}
			MessageCollection.prototype.add.apply(this, message);
		}
	});

	return UnifiedMessageCollection;
});
