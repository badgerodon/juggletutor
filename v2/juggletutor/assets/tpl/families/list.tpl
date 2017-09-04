<div class="container family-list">
	<div class="body">
<% _.each(Styles, function(style) { %>
		<h2><%-style.Name%></h2>
		<ul>
		<% _.each(style.Families, function(family) { %>
			<li>
				<a href="/families/<%-family.Name%>-<%-style.Name%>-<%-family.Counts[0]%>"><%-family.Name%></a>
				<small>(<%_.each(family.Counts, function(count, i) {
					%><% if (i > 0) { %>, <% }
					%><a href="/families/<%-family.Name%>-<%-style.Name%>-<%-count%>"><%-count%></a><%
				})%>)</small>
			</li>
		<% }) %>
		</ul>
<% }) %>
	</div>
</div>
