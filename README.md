# Email Template
Make email HTML in front end.

demo:[http://demo.ruosen.io/email_template/](http://demo.ruosen.io/email_template/)

## Usage

### Add new template
edit index.html
the `{{main}}` is the body mark.
```
<div id="template" style="display:none;">
    <div name="template_name_whatever_you_want">
        I'm a new template
        {{main}}
    </div>
</div>

```

### Add module

1. Module's data

Add an object in array `JSON_MODULE` at the top of index.html.

```
{
    name:"custom_name", // required , display name for user
    type:'custom_type', // required , unique name for code
    custom_key,
    ...
},
```

2. Module's panel

Add a piece of html in `#panel_module` with the attribute `name` which value is the type that defined in previous step.

```
<div class="module" name="custom_type">
    custom_name:
    custom_key：<input type="text" v-model="item.custom_key">
</div>
```

3. Module's display

Add a piece of html in `#display_module` with the attribute `name` you know.

```
<div class="module" name="custom_type">
   {{custom_key}}
</div>
```





