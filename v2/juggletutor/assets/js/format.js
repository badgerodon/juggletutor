jt.Format = {
  familyAttributes: function(attributes) {
    return _.map(
      _.groupBy(attributes, function(v) {
        return jt.Globals.Values[v-1].AttributeId;
      }),
      function(valueIds, attributeId) {
        return jt.Globals.Attributes[attributeId-1].Name + ": " + _.map(
          valueIds,
          function(id) { return jt.Globals.Values[id-1].Name; }
        ).join(", ");
      }
    ).join("\n");
  },
	date: function(date) {
		return moment(date).fromNow();
	}
}
