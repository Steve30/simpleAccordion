(function($) {
	$.fn.extend({
		simpleAccordion : function(options) {

			this.defaults = {
				accordionType : 'vertical',
				menuItemContainerClass : '.menu-item',
				defaultPageNumber : 1,
				speed : 500
			};

			this.plugin = {
				el : 					undefined,
				opt : 					undefined,
				menuItemContClass : 	undefined,
				menuItemContainers : 	undefined,
				menuItemBtns : 			undefined,
				accordionContents : 	undefined,
				accordionArrays : 		new Array(),
				animSpeed : 			null,
				type : 					undefined,
				isClicked : 			false,
				defaultPageNumber : 	null,

				initialize : function() {
					this.el = $(arguments[0]);
					this.opt = arguments[1];
					
					this.menuItemContClass =	this.opt.menuItemContainerClass; 
					this.menuItemContainers = 	$(this.menuItemContClass);
					this.menuItemBtns = 		this.el.find('a');
					this.accordionContents = 	this.menuItemContainers.find('div');
					this.accordionArrays = 		new Array();
					this.animSpeed = 			this.opt.speed;
					this.type = 				this.opt.accordionType;
					this.isClicked = 			false;
					this.defaultPageNumber = 	this.opt.defaultPageNumber;
					
					this.build();
					
				},

				build : function() {
					
					if (this.type === 'horizontal') {
						this.horizontalAccordion();
					} else {
						this.verticalAccordion();
					}
					
					this.addEvents();
				},
				
				horizontalAccordion: function() {
					var newWidth = this.el.width() / this.menuItemContainers.length,
						newHeight, obj,
						self = this;

					this.menuItemContainers.each(function(index) {
						
						$(this).css({
							float : 'left',
							width : newWidth + 'px'
						});

						newHeight = self.accordionContents.eq(index).height();

						self.accordionContents.eq(index).css({
							width : newWidth + 'px'
						});

						self.menuItemBtns.eq(index).css({
							height : '+=' + newHeight + 'px',
							width : 'auto'
						});

						self.menuItemBtns.eq(index).children().rotate(-90);
						self.menuItemBtns.eq(index).children().css({marginTop : '20px'});

						obj = {
							position : index,
							dim : newWidth
						};

						if (index !== (self.defaultPageNumber - 1)) {
							var containerWidth = self.menuItemBtns.eq(index).width() + 1;
							$(this).css({width : containerWidth	+ 'px'});
						} else {
							$(this).addClass('show');
						}

						self.accordionArrays.push(obj);

					});
				},
				
				verticalAccordion: function() {
					var self = this;
					
					this.accordionContents.each(function(index) {
						var dim = $(this).height();

						var obj = {
							position : index,
							dim : dim
						};

						if (index === (self.defaultPageNumber - 1)) {
							$(this).parents('li').css({
								paddingBottom : dim - self.menuItemBtns.eq(index).height() + 'px'}).addClass('show');
						}

						$(this).height(0);

						self.accordionArrays.push(obj);
					});
				},
				
				addEvents : function() {
					this.menuItemBtns.on({
						click : this.clickedItem
					}, {self: this});
				},

				clickedItem : function(e) {
					e.preventDefault();
					e.stopPropagation();

					var selectedItemId = $(this).attr('id'),
						self = e.data.self;
					
					if ($(this).parents('li').hasClass('show')) {
						return false;
					} else {
						self.menuItemContainers.filter('.show').removeClass('show');
						$(this).parents('li').addClass('show');
					}

					self.menuItemBtns.each(function(index) {

						var elId = $(this).attr('id');

						if (elId === selectedItemId) {

							if (self.type === 'horizontal') {
								self.horizontalAnimation($(this), index);
							} else {
								self.verticalAnimation($(this), index);
							}

						} else {

							if (self.type === 'horizontal') {
								self.horizontalAnimation($(this), index);
							} else {
								self.verticalAnimation($(this));
							}

						}
					});
				},

				horizontalAnimation : function(el, index) {
					var itemContainer = el.parents('li');

					if (itemContainer.hasClass('show')) {
						itemContainer.animate({
							width : this.accordionArrays[index].dim + 'px'
						}, this.animSpeed);
					} else {
						itemContainer.animate({
							width : this.menuItemBtns.eq(index).width() + 1
						}, this.animSpeed);
					}
				},

				verticalAnimation : function(el, index) {
					if (index === undefined) {
						el.parents('li').animate({
							paddingBottom : 0
						}, this.animSpeed);
					} else {
						el.parents('li').animate({
							paddingBottom : this.accordionArrays[index].dim	- this.menuItemBtns.eq(index).height() + 'px'
						}, this.animSpeed);
					}
				}
			};

			this.init = function(opt) {
				$.proxy(this.plugin.initialize(this, opt), this.plugin);
			};

			constructor = function(plugin) {
				plugin.options = $.extend(self.defaults, options);
				plugin.init(plugin.options);
			}(this);

		}
	});
})(jQuery);
