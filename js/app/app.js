$(function () {
document.oncontextmenu = function() {return false;};
	/**Model of 1 Sticker	*/
	var	StickerModel = Backbone.Model.extend({
	        defaults: {
			  title: "Sticker"
	        }
		});
		
	/**Collection of all Stickers	*/
	var StickerCollection = Backbone.Collection.extend({
	  		model: StickerModel,
			//url: '/stickers.json',
	  		initialize: function(){
	  		console.log("StickerCollection init")
	  		//this.fetch();
	 		}
		});
/**View for 1 Sticker	*/
	var StickerView = Backbone.View.extend({
		className: "sticker",
		template: _.template($("#sticker-template").html()),
	
	  events: {
		'click .sticker-close': 'close',
		'contextmenu': 'edit',
		'mousedown': 'raise'
	  },
	  /**
	* Рендерит стикер и располагает его поверх остальных.
	*/
	render: function () {
		$(this.el).html(this.template);
		//$(this.el).html(this.template(this.model.toJSON()));
		// Делаем текущий стикер активным
		$('.sticker-active').removeClass('sticker-active');
		$(this.el).addClass('sticker-active');
		$(this.el).addClass('sticker-hidetext');
		// Начальный z-index, минимальное значение которое может получить стикер
		var max_z = 100;
		
		$('.sticker').each(function () {
		  var curr_z = parseInt($(this).css('z-index'));
		  if (curr_z > max_z) {
			max_z = curr_z;
		}
	});
    
    $(this.el).css({ 'z-index': max_z + 10 });
    
    return this;
  },
    /**
	* обработка нажатия правой кнопкой
	*/
  edit: function() {
		$('.sticker-active').removeClass('sticker-active');
		$(this.el).addClass('sticker-active');
		console.log('rclick')
		$(this.el).addClass('sticker-showtext')
		$(this.el).find('textarea').focus()	
	//stopPropagation()
	},
	
  initialize: function () {
    this.template = $('#sticker-template').html();
    function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
    this.width = '200px';
    this.height = '200px';
    this.top = getRandomInt(100, 400) + 'px';
    this.left = getRandomInt(200, 500) + 'px';
    
    $(this.el).css({
      'width': this.width,
      'height': this.height,
      'top': this.top,
      'left': this.left,
      'position': 'absolute',
    });
    $(this.el).draggable();
  },
  /**
   * Поднимает стикер наверх и делает его активным
   * по нажатию кнопки мыши.
   */
  raise: function (e) {
    if (!$(this.el).hasClass('sticker-active')) {
		var max_z = 0;
		$('.sticker-active').find('textarea').blur()
		$('.sticker-active').removeClass('sticker-active');
		$('.sticker').each(function () {   
		var curr_z = parseInt($(this).css('z-index'));
		if (curr_z > max_z) {
		  max_z = curr_z;
		}
		});
	$(this.el).css({ 'z-index': max_z + 10 });
	$(this.el).addClass('sticker-active')
	}
  },
  /**
  * Удаляет sticker из DOM.
  */
  close: function () {
    $(this.el).remove();
		var max_z = 0;
		var top = null;
		// Выбираем самый верхний их оставшихся стикеров
		$('.sticker').each(function () {
			var curr_z = parseInt($(this).css('z-index'));
			if (curr_z > max_z) {
			max_z = curr_z;
			top = this;
			}
		});
		// Делаем его активным
			if (top) {
			  $(this.el).addClass('sticker-showtext')
			  $(top).addClass('sticker-active')
			}
		  }
	});
	/**View for Sticker	Collection */
	var StickerCollectionView = Backbone.View.extend({
	  		initialize: function () {
	  			this.field = new StickerCollection();
	  		},

	   		el: $("#field"),

	   		events: {
				"click" : "render"
			},
			
			addSticker: function() {
				new_sticker = new StickerModel()
				this.field.add(new_sticker)
				stickerview = new StickerView()
				//console.log(stickerview);
				this.$el.append(stickerview.render().el)

				return false;
			},	

			render: function(){
				var self = this;
				console.log("AppView render");
				this.addSticker();
			}		
	 	}),

	App = new StickerCollectionView();
});