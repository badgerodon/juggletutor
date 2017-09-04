<table>
  <thead>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
  <% _.each(Users, function(user) { %>
    <tr>
      <td><%-user.Id%></td>
      <td><%-user.Name%></td>
      <td>
        <%=mkSelect("Type", {
          "": "User",
          "Moderator": "Moderator",
          "Admin": "Admin"
        }, user.Type)%>
      </td>
    </tr>
  <% }) %>
  </tbody>
</table>