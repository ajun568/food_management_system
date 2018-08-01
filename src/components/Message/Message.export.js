import Vue from 'vue';
import MessageBox from './Message.vue';

let MessageConstructor = Vue.extend(MessageBox);
let instance;

const Message = function(options={}) {
	if (typeof options === 'string') {
    options = {
      message: options
    };
  }

  instance = new MessageConstructor({
    data: options,
  });

  instance.vm = instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.vm.$el);

  return instance.vm;
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;

    return Message(options);
  };
});

export default Message;