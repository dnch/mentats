var ScrollingSourceList = Class.create({
  initialize: function(target_container_id, column_names, include_header) {
    this.target_container_id = target_container_id;    // into which element do we put the table?
    this.column_names        = column_names;                // are we going to draw our thead?
    this.include_header      = include_header;         // what order are the columns? (should be an array of strings, ie: "")

    this.even_row_marker     = "even";
    this.odd_row_marker      = "odd";
    this.callback            = null;

    this.createTableTag();
    this.resetTableBody();
  },

  // simple utility functions to get at the elements we need to futz with
  targetContainer:  function() { return $(this.target_container_id) },
  tableBody:        function() { return this.targetContainer().select('tbody')[0] },

  createTableTag: function() {
    new_table = new Element('table');
    
    this.targetContainer().insert(new_table);

    // TODO add code to create headers if we ever need them.
  },
  
  // empties the table of all rows in preparation for an updated batch
  resetTableBody: function() {
    _target_table = this.targetContainer().select('table')[0]

    if(_target_table.empty()) {
      _target_table.insert(new Element('tbody'));
    } else {
      _target_table.select('tbody')[0].replace(new Element('tbody'));
    }
  },
  
  // does what it says on the lid
  clearSelectedRow: function() {    
    table_rows = this.tableBody().select('.selected');
    
    if(table_rows.size() > 0) {
      table_rows[0].removeClassName('selected');
    }
  },


  // adds an item to the table list
  // columns - a JSON object with the name / value pairs for cell values
  // row_attributes - JSON object which will be convered to attributes applied to the table row
  // selected - mark this as "selected" if true
  addItem: function(column_data, row_attributes, selected) {    
    // build our row...
    _row         = new Element('tr', row_attributes);
    _column_data = $H(column_data)
    
    // add our columns
    this.column_names.each(function(column_name) {      

      _cell_value      = $H(_column_data.get(column_name)).get('value');
      _cell_attributes = $H(_column_data.get(column_name)).get('attributes');
      
      new_cell = new Element('td', _cell_attributes);
      new_cell.update(_cell_value);
      new_cell.addClassName(column_name);

      _row.insert(new_cell)
    }, this);
    
    
    if(selected == "true") {
      _row.addClassName('selected');
    }
    
    // do shit
    _row.observe('click', this.sourceItemClickHandler.bindAsEventListener(this));
    
    // shove it in
    this.tableBody().insert(_row);
  },

  // the callback called when one of the elements in the
  sourceItemClickHandler: function(event) {
    if (loss_prevention_agent.safeToProceed()) { 
      this.clearSelectedRow();

      _row = event.findElement('tr');
      _row.addClassName('selected');

      if(this.callback != null) {
        this.callback(_row);
      }
    }
  },
  
  setCallback: function(fn) {
    this.callback = fn;
  },
  
  fillFromObjectArray: function(array, data_block) {
    array.each(function(arg){
      this.addItem($H(arg).get('column_data'), $H(arg).get('row_attributes'), $H(arg).get('selected'))
    }, this);
  },  
});