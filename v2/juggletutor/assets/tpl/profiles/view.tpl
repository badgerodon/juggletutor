<div class="container" id="profiles-view">
	<div class="body">
<% if (User.Picture) { %>
		<img src="<%-User.Picture%>" style="max-width: 100px" />
<% } %>
		<h2><%-User.Name%></h2>
		<table>
<% _.each(Achievements, function(sections, style) { %>
		<tr>
			<th class="style" colspan="2"><%-style%></th>
		</tr>
	<% _.each(sections, function(tricks, section) { %>
		<tr>
			<th><%-section%></th>
			<td>
		<% _.each(tricks, function(trick) { %>
		<span class="trick">
		<% if (trick.Demonstration) { %>
			<a href="/videos/<%-trick.Demonstration%>">
				<i class="icon-film"></i>
			</a>
		<% } %>
		<% if (trick.Tutorial) { %>
			<a href="/videos/<%-trick.Tutorial%>">
				<i class="icon-lightbulb"></i>
			</a>
		<% } %>
		<%-trick.Name%>
		</span>
		<% }) %>
			</td>
		</tr>
	<% }) %>
<% }) %>
		</table>
	</div>
</div>