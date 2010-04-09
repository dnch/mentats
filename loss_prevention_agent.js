var LossPreventionAgent = Class.create({
  initialize: function(form_id) {
    this.form_id  = form_id
    this.clean    = true;
    this.resetAgent();
  },
  
  triggerChange: function() {
    this.clean = false;
  },
  
  safeToProceed: function() {
    return this.clean || confirm('You have unsaved changes, are you sure you wish to continue?');
  },
  
  resetAgent: function() {
    this.observer = new Form.Observer(this.form_id, 0.3, this.triggerChange.bind(this));
  }
});