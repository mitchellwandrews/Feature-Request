function TicketListViewModel(defaultPage) {
  this.ticket = {};
  this.Page = ko.observable(defaultPage);

  this.addTicket = function(){
    console.log('TICKET', this.ticket);
    $.ajax({
      url: '/ticket/new',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({
        'title': this.ticket.title,
        'description': this.ticket.description,
        'client': this.ticket.client,
        'client_priority': this.ticket.client_priority,
        'target_date': this.ticket.target_date,
        'product_area': this.ticket.product_area
      }),
      success: function(data){
        console.log(data);
        return window.location = '/';
      },
      error: function() {
        return console.log("FAIL");
      }
    });
  };

  this.goToTicket = function(id){
    var page = $.ajax({
      url: '/ticket',
      contentType: 'application/json',
      type: 'GET',
      data: JSON.stringify({
        'id': id
      }),
      success: function(data){
        console.log(data);
        return 'oneup';
      },
      error: function(){
        return console.log("FAIL");
      }
    });
    console.log(page);
  };

  this.goToAdd = function() {
    this.Page("add");
  };

  this.goToIndex = function() {
    this.Page("index");
  };
}

ko.applyBindings(new TicketListViewModel('index'));
