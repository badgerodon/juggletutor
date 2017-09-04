<div class="container" id="demonstration-new">
	<div class="body">
		<h2>New Demonstration</h2>
		<div class="help">
			<span class="step">1</span>
			Pick Attributes
		</div>
		<table class="attributes">
			<tbody>
			<% _.each(Attributes, function(attribute) { %>
				<tr>
					<th><%-attribute.Name%></th>
					<td>
						<select name="<%-attribute.Name%>">
							<option value="">Choose a Value</option>
						<% _.each(attribute.Options, function(option) { %>
							<option value="<%-option.Name%>"<% if(option.Selected) { %> selected="SELECTED"<% } %>><%-option.Name%></option>
						<% }) %>
						</select>
					</td>
				</tr>
			<% }) %>
		</table>
		<div class="help">
			<span class="step">2</span>
			Record Demonstration
		</div>
		<div id="widget" style="display: none"></div>

		<div class="help">
			<span class="step">3</span>
			Submit for Review
		</div>

		<div class="buttons">
			<button class="btn btn-large cancel">Cancel</button>
			<button class="btn btn-large btn-primary save">Save</button>
		</div>
	</div>
</div>
