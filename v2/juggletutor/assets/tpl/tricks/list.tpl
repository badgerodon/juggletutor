<div id="trick-list" class="container">
	<div class="nav nav2-1">
		<% _.each(tabs1, function(tab) { %>
		<a href="<%-tab.link%>"<% if (tab.selected) {%> class="selected"<%}%>>
			<%-tab.name%>
		</a>
		<% }) %>
	</div>
	<div class="nav nav2-2">
		<% _.each(tabs2, function(tab) { %>
		<a href="<%-tab.link%>"<% if (tab.selected) {%> class="selected"<%}%>>
			<%-tab.name%>
		</a>
		<% }) %>
	</div>
	<div class="body">
		<table>
			<thead>
				<tr>
					<th>Standard</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Cascade</td>
					<td><i class="icon-trophy"></i></td>
				</tr>
			</tbody>
		</table>
		<table>
			<thead>
				<tr>
					<th>Multiplex</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Cascade</td>
					<td><i class="icon-trophy"></i></td>
				</tr>
			</tbody>
		</table>
		<br style="clear:both">
	</div>
</div>
