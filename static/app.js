function TicketListViewModel(defaultPage) {
  this.Page = ko.observable(defaultPage);
  this.tickets = ko.observableArray([]);
  this.ticketType = ko.observable();
  this.ticket = {
    'title': ko.observable(),
    'client': ko.observable(),
    'description': ko.observable(),
    'client_priority': ko.observable(),
    'target_date': ko.observable(),
    'product_area': ko.observable(),
    'id': ko.observable()
  }
  var self = this;

  $.getJSON('/tickets', function(data){
    self.tickets(data.tickets);
  })

  this.addTicket = function(){
    var date = moment(this.ticket.target_date()).format('MMM D YYYY');
    if(self.ticketType() === 'Add'){
      $.ajax({
        url: '/ticket/new',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
          'title': this.ticket.title(),
          'description': this.ticket.description(),
          'client': this.ticket.client(),
          'client_priority': this.ticket.client_priority(),
          'target_date': date,
          'product_area': this.ticket.product_area()
        })
      }).done(function(data){
        $.getJSON('/tickets', function(data){
          self.tickets(data.tickets);
        })
        return self.goToIndex();
      }).fail(function(data){
        return console.log(data);
      });
    } else {
      $.ajax({
        url: '/ticket/update',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
          'id': this.ticket.id(),
          'title': this.ticket.title(),
          'description': this.ticket.description(),
          'client': this.ticket.client(),
          'client_priority': this.ticket.client_priority(),
          'target_date': date,
          'product_area': this.ticket.product_area()
        })
      }).done(function(data){
        $.getJSON('/tickets', function(data){
          self.tickets(data.tickets);
        })
        return self.goToIndex();
      }).fail(function(data){
        return console.log(data);
      });
    }
  };

  self.deleteTicket = function(){
    ticket_id = self.ticket.id();
    $.ajax({
      url: '/ticket/delete',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({'id': ticket_id})
    }).done(function(data){
      $('#deleteTicketModal').modal('hide');
      $.getJSON('/tickets', function(data){
        self.tickets(data.tickets);
      })
      return console.log(data);
    }).fail(function(data){
      return console.log(data);
    });
  };

  self.goToTicket = function(ticket){
    self.ticket.client(ticket.client);
    self.ticket.title(ticket.title);
    self.ticket.description(ticket.description);
    self.ticket.client_priority(ticket.client_priority);
    self.ticket.target_date(ticket.target_date);
    self.ticket.product_area(ticket.product_area);
    self.Page("oneup");
  };

  self.editTicket = function(ticket){
    self.ticketType("Edit");
    self.ticket.client(ticket.client);
    self.ticket.title(ticket.title);
    self.ticket.description(ticket.description);
    self.ticket.client_priority(ticket.client_priority);
    self.ticket.target_date(moment(ticket.target_date).utc());
    self.ticket.product_area(ticket.product_area);
    self.ticket.id(ticket.id);
    self.Page("add");
  }

  self.showDeleteModal = function(ticket){
    self.ticket.title(ticket.title);
    self.ticket.id(ticket.id);
    $('#deleteTicketModal').modal('show');
  };

  this.goToAdd = function() {
    $('#ticketForm')[0].reset();
    self.ticketType("Add");
    self.ticket.client(null);
    self.ticket.title(null);
    self.ticket.description(null);
    self.ticket.client_priority(null);
    self.ticket.target_date(null);
    self.ticket.product_area(null);
    self.ticket.id(null);
    this.Page("add");
  };

  this.goToIndex = function() {
    this.Page("index");
  };

}

ko.applyBindings(new TicketListViewModel('index'));
