<div class="container family-view" data-Family="<%-Name%>" data-Style="<%-Style%>" data-Count="<%-Count%>">
	<div class="body">
		<div class="buttons">
			<button class="btn new-demonstration"><i class="icon icon-film"></i> New Demonstration</button>
			<button class="btn new-lesson"><i class="icon icon-book"></i> New Lesson</button>
		</div>
		<h2><%-Name%></h2>
	<% _.each(Options, function(option) { %>
		<h3>
			<%-option.Name%>:
		<% _.each(option.Values, function(value) { %>
			<a href="<%-value.Link%>"<% if (value.Selected) {%> class="selected"<%}%>><%-value.Name%></a>
		<% }) %>
		</h3>
	<% }) %>
	</div>
</div>
<div class="container">
	<div class="nav">
		<% _.each(Tabs, function(tab) { %>
		<a href="<%-tab.Link%>"<% if (tab.Selected) {%> class="selected"<%}%>>
			<%-tab.Name%>
		</a>
		<% }) %>
	</div>
	<div class="body">
		<%=Body%>
	</div>
</div>
