var TagListController = Class.create({
  // init. durh.
  initialize: function(tag_list_element_id, empty_list_message, hidden_field_name) {
    this.list_element_id    = tag_list_element_id;
    this.empty_list_message = empty_list_message;
    this.hidden_field_name  = hidden_field_name;

    this.reInit();
  },
  
  reInit: function() {
    this.list_element = $(this.list_element_id);
    this.list_element.insert(new Element('p').update(this.empty_list_message));    
  },

  // build a new widget, ready to be added
  build: function(caption, value) {
    var _widget      = new Element('li');
    var _closeButton = new Element('a', { 'href' : '#'});

    _closeButton.insert(new Element('span').update("Remove"));
    _closeButton.observe('click', this._remove.bindAsEventListener(this))

    _widget.insert(new Element('span').update(caption));
    _widget.insert(_closeButton);
    _widget.insert(new Element('input', { 'type' : 'hidden', 'value' : value, 'name' : this.hidden_field_name }));

    return _widget;
  },

  // returns an extended array of all the values of all the hidden elements in the list_element.
  existingValues: function() {
    return this.list_element.select("li input[type='hidden']").pluck('value');
  },

  // adds a widget to the list_element
  add: function(caption, value) {
    if (!this.existingValues().include(value) && value != "")
    {
      this.list_element.insert(this.build(caption, value));
    }

    this.hideEmptyMessage();
  },

  // removes a widget from the list_element
  _remove: function(event) {
    event.stop();
    event.findElement().up('li').remove();

    if (this.list_elementIsEmpty()) {
      this.showEmptyMessage();
    }
  },

  // makes a check to see if the list_element has any widgets in it.
  list_elementIsEmpty: function() {
    return (this.list_element.select('li').size() == 0);
  },

  // shows the "EMPTY BUCKET" message
  showEmptyMessage: function() {
    this.list_element.select("p").first().show();
  },

  hideEmptyMessage: function() {
    this.list_element.select("p").first().hide();
  },
  
  fillFromObjectArray: function(array, value_attribute, caption_attribute) {
    array.each(function(o){
    
      obj = $H(o);      

      this.add(obj.get(caption_attribute), obj.get(value_attribute))
    }, this);
  },

});