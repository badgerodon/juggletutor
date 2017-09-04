<div class="container trick">
	<div class="body">
		<% if (animation) { %>
		<img class="animation" src="<%-animation%>">
		<% } %>
		<h2><%-name%></h2>
	<% _.each(options, function(option) { %>
		<h3>
			<%-option.name%>:
		<% _.each(option.values, function(value) { %>
			<a href="<%-value.link%>"<% if (value.selected) {%> class="selected"<%}%>><%-value.name%></a>
		<% }) %>
		</h3>
	<% }) %>
	</div>
	<br style="clear: both">
</div>
<div class="container">
	<div class="nav">
		<% _.each(tabs, function(tab) { %>
		<a href="/tricks/<%-key%>/<%-tab.link%>"<% if (tab.selected) {%> class="selected"<%}%>>
			<%-tab.name%>
		</a>
		<% }) %>
	</div>
	<div class="body">
		<%=body%>
	</div>
</div>
