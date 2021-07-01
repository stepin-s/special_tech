// полифилл CustomEvent для IE11
(function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    window.CustomEvent = CustomEvent;
  })();

  $modal = function (options) {
    var
      _elemModal,
      _eventShowModal,
      _eventHideModal,
      _hiding = false,
      _destroyed = false,
      _animationSpeed = 200;

    function _createModal(options) {
      var
        elemModal = document.createElement('div'),
        modalTemplate = '<div class="modal__backdrop" data-dismiss="modal"><div class="modal__content"><div class="modal__header"><div class="modal__title" data-modal="title">{{title}}</div><span class="modal__btn-close" data-dismiss="modal" title="Закрыть">×</span></div><div class="modal__body" data-modal="content">{{content}}</div>{{footer}}</div></div>',
        modalFooterTemplate = '',//<div class="modal__footer">{{buttons}}</div>
        modalButtonTemplate = '<button type="button" class="{{button_class}}" data-handler={{button_handler}}>{{button_text}}</button>',
        modalHTML,
        modalFooterHTML = '';

      elemModal.classList.add('modal');
      modalHTML = modalTemplate.replace('{{title}}', options.title || '');
      modalHTML = modalHTML.replace('{{content}}', options.content || '');
      if (options.footerButtons) {
        for (var i = 0, length = options.footerButtons.length; i < length; i++) {
          var modalFooterButton = modalButtonTemplate.replace('{{button_class}}', options.footerButtons[i].class);
          modalFooterButton = modalFooterButton.replace('{{button_handler}}', options.footerButtons[i].handler);
          modalFooterButton = modalFooterButton.replace('{{button_text}}', options.footerButtons[i].text);
          modalFooterHTML += modalFooterButton;
        }
      }
      modalFooterHTML = modalFooterTemplate.replace('{{buttons}}', modalFooterHTML);
      modalHTML = modalHTML.replace('{{footer}}', modalFooterHTML);
      elemModal.innerHTML = modalHTML;
      document.body.appendChild(elemModal);
      return elemModal;
    }

    function _showModal() {
      if (!_destroyed && !_hiding) {
        _elemModal.classList.add('modal__show');
        document.dispatchEvent(_eventShowModal);
      }
    }

    function _hideModal() {
      _hiding = true;
      _elemModal.classList.remove('modal__show');
      _elemModal.classList.add('modal__hiding');
      setTimeout(function () {
        _elemModal.classList.remove('modal__hiding');
        _hiding = false;
      }, _animationSpeed);
      document.dispatchEvent(_eventHideModal);
    }

    function _handlerCloseModal(e) {
      if (e.target.dataset.dismiss === 'modal') {
        _hideModal();
      }
    }

    _elemModal = _createModal(options);

    _elemModal.addEventListener('click', _handlerCloseModal);
    _eventShowModal = new CustomEvent('show.modal', { detail: _elemModal });
    _eventHideModal = new CustomEvent('hide.modal', { detail: _elemModal });

    return {
      show: _showModal,
      hide: _hideModal,
      destroy: function () {
        _elemModal.parentElement.removeChild(_elemModal),
          _elemModal.removeEventListener('click', _handlerCloseModal),
          destroyed = true;
      },
      setContent: function (html) {
        _elemModal.querySelector('[data-modal="content"]').innerHTML = html;
      },
      setTitle: function (text) {
        _elemModal.querySelector('[data-modal="title"]').innerHTML = text;
      }
    }
  };

  (function () {
    var elemTarget;
    var modal = $modal({
      title: 'Перезвоните мне',
      content: '<form action="" class="order"><div class="row"><div class="col-25"><label for="country">Имя и телефон</label></div><div class="col-75"><input type="text" name="order__fio" placeholder="" ></div></div><div class="row"><div class="col-25"><label for="country">Телефон</label></div><div class="col-75"><input type="text" name="order__phone" placeholder="+7" ></div></div><div class="row"><div class="col-25"><label for="subadressject">Доп. информация</label></div><div class="col-75"><textarea id="adress" name="adress" placeholder=""></textarea></div></div><div class="mid__row"><input type="checkbox" id="accept" name="accept" value="yes" checked><label class="agree__label" for="accept"><span></span>Соглашаюсь на обработку персональных данных</label><div class="row row__submit"><input type="submit" value="Отправить" class="order__submit"></div></div></form>',
      footerButtons: [
        { class: 'btn btn-2', text: 'ОК', handler: 'modalHandlerOk' },
        { class: 'btn btn-1', text: 'Отмена', handler: 'modalHandlerCancel' }
      ]
    });
    document.addEventListener('show.modal', function (e) {
      // получить ссылку на DOM-элемент показываемого модального окна (.modal)
      console.log(e.detail);
    });
    document.addEventListener('hide.modal', function (e) {
      // получить ссылку на DOM-элемент скрываемого модального окна (.modal)
      console.log(e.detail);
    });
    document.addEventListener('click', function (e) {
      if (e.target.dataset.toggle === 'modal') {
        elemTarget = e.target;
        modal.show();
      } else if (e.target.dataset.handler === 'modalHandlerCancel') {
        modal.hide();
      } else if (e.target.dataset.handler === 'modalHandlerOk') {
        modal.hide();
      } else if (e.target.dataset.dismiss === 'modal') {
      }
    });
  })();
