<div id="trick-table" class="container">
	<div class="nav nav2-1">
		<% _.each(tabs1, function(tab) { %>
		<a href="#" data-args="<%-tab.args%>"<% if (tab.selected) {%> class="selected"<%}%>>
			<%-tab.name%>
		</a>
		<% }) %>
	</div>
	<div class="nav nav2-2">
		<% _.each(tabs2, function(tab) { %>
		<a href="#" data-args="<%-tab.args%>"<% if (tab.selected) {%> class="selected"<%}%>>
			<%-tab.name%>
		</a>
		<% }) %>
	</div>
	<div class="body">
		<table>
			<thead>
				<tr>
					<th class="name">Trick</th>
					<th class="status">Demonstration</th>
					<th class="status">Lesson</th>
				</tr>
			</thead>
			<tbody>
		<% _.each(tricks, function(trick) { %>
			<% if (trick.Link) { %>
				<tr>
					<td class="name">
						<a href="<%-trick.Link%>" style="margin-left: <%-(trick.Depth||0)*10%>px;">
							<%-trick.Name%>
						</a>
					</td>
					<td class="status">
					<% if (trick.Demonstration.Status === Constants.Submitted) { %>
						<i class="icon-legal"></i>
					<% } else if (trick.Demonstration.Status === Constants.Accepted) { %>
						<i class="icon-trophy"></i>
					<% } else { %>
						<i class="icon-circle-blank"></i>
					<% } %>
					</td>
					<td class="status">
					<% if (trick.Lesson.Status === Constants.Submitted) { %>
						<i class="icon-legal"></i>
					<% } else if (trick.Lesson.Status === Constants.Accepted) { %>
						<i class="icon-trophy"></i>
					<% } else { %>
						<i class="icon-circle-blank"></i>
					<% } %>
					</td>
				</tr>
			<% } else { %>
				<tr>
					<td class="name" colspan="3">
						<span style="margin-left: <%-(trick.Depth||0)*10%>px;"><%-trick.Name%></span>
					</td>
				</tr>
			<% } %>
		<% }) %>
			</body>
		</table>
		<br style="clear:both">
	</div>
</div>
