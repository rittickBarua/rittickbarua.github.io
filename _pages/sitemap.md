---
layout: archive
title: "Sitemap"
permalink: /sitemap/
author_profile: true
sitemap: false
---

{% include base_path %}

A list of all pages found on the site. For crawlers, there is also an [XML version]({{ base_path }}/sitemap.xml).

<h2>Pages</h2>
{% for post in site.pages %}
  {% unless post.sitemap == false or post.title == nil %}
    {% include archive-single.html %}
  {% endunless %}
{% endfor %}

{% if site.posts.size > 0 %}
<h2>Posts</h2>
{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}
{% endif %}

{% capture written_label %}'None'{% endcapture %}

{% for collection in site.collections %}
{% unless collection.output == false or collection.label == "posts" %}
  {% if collection.docs.size > 0 %}
    {% capture label %}{{ collection.label }}{% endcapture %}
    {% if label != written_label %}
  <h2>{{ label | capitalize }}</h2>
      {% capture written_label %}{{ label }}{% endcapture %}
    {% endif %}
    {% for post in collection.docs %}
      {% include archive-single.html %}
    {% endfor %}
  {% endif %}
{% endunless %}
{% endfor %}
