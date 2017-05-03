/*!
 * Jquery Selectpicker v1.1.0, https://git.io/vDjMR
 * ===================================
 * jQuery plugin for autocomplete & dropdown
 *
 */
$(function(){
    $.widget( "ui.combobox", {
        _create: function() {
            this.wrapper = $( "<span>" ).addClass( "select" ).insertAfter( this.element );
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },
 
        _createAutocomplete: function() {
            var selected = this.element.children( ":selected" ),
                value = selected.val() ? selected.text() : "",
                placeholder = this.element.children(":selected").text();
            this.input = $( "<input>" ).appendTo( this.wrapper ).val( value ).attr( "title", "" ).attr("placeholder", placeholder).addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" ).tooltip({classes: {"ui-tooltip": "ui-state-highlight"}});

            this.input.autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: $.proxy( this, "_source" )
                })
                .data("ui-autocomplete")._renderItem = function(ul, item) {
                
                    if (typeof item.value === 'undefined' || !item.value) {
                        var $el = $("<li>");
                        $el.hide();
                        return $el.appendTo(ul);
                    }
                    var $el = $("<li>");
                    if (item.group == true) {
                        $el.addClass("ui-state-disabled")
                           .text(item.label);

                    } else if (item.group == false) {
                        $el.addClass("ui-child-label")
                           .text(item.label);
                    } else {
                        $el.append("<a>" + item.label + "</a>");
                    }
                    
                    return $el.appendTo(ul);
            };

            this._on( this.input, {
              autocompleteselect: function( event, ui ) {
                ui.item.option.selected = true;
                this._trigger( "select", event, {
                  item: ui.item.option
                });
              },
     
              autocompletechange: "_removeIfInvalid"
            });
        },
 
        _createShowAllButton: function() {
            var input = this.input,
                wasOpen = false;
     
            $( "<a>" ).attr( "tabIndex", -1 ).appendTo( this.wrapper ).button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            }).removeClass( "ui-corner-all" ).addClass( "custom-combobox-toggle ui-corner-right" ).on( "mousedown", function(){
                wasOpen = input.autocomplete( "widget" ).is( ":visible" );
            }).on( "click", function() {
                input.trigger( "focus" );
     
                // Close if already visible
                if ( wasOpen ) {
                  return;
                }
     
                // Pass empty string as value to search for, displaying all results
                input.autocomplete( "search", "" );
            });
        },
     
        _source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            
            if (this.element.children("optgroup").length > 0 ) {
                response(this.element.children( "optgroup" ).map(function() {
                    var responsevar = [];
                    var text_label = $( this ).attr('label');
                    
                    if (  !request.term || matcher.test(text_label) ) {
                        var response = {
                            label: text_label,
                            value: text_label,
                            group: true,
                            option: this
                        };
                        responsevar.push(response);
                    }
                    $(this).children('option').map(function() {
                        var text = $(this).text();
                        
                        if ( $(this).val() && ( !request.term || matcher.test(text) ) ) {
                            var response = {
                                label: text,
                                value: text,
                                group: false,
                                option: this
                            };
                            responsevar.push(response);
                        }
                    });
                    return responsevar;
                }));
            } else {
                response( this.element.children( "option" ).map(function() {
                    
                    var text = $( this ).text();
                    
                    if ( this.value && ( !request.term || matcher.test(text) ) )
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
                }));
            }
        },

        _removeIfInvalid: function( event, ui ) {
     
            // Selected an item, nothing to do
            if ( ui.item ) {
                return;
            }
            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children( "option" ).each(function() {
                if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                    this.selected = valid = true;
                    return false;
                }
            });
     
            // Found a match, nothing to do
            if ( valid ) {
                return;
            }
     
            // Remove invalid value
            this.input
                .val( "" )
                .attr( "title", value + " didn't match any item" )
                .tooltip( "open" );
            this.element.val( "" );
            this._delay(function() {
                this.input.tooltip( "close" ).attr( "title", "" );
            }, 2500 );
            this.input.autocomplete( "instance" ).term = "";
        },
     
        _destroy: function() {
            this.wrapper.remove();
            this.element.show();
        }
    });
});
