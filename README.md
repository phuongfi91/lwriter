This project aims to combine Google Translate with Wiktionary to aid language writing and learning.

The project is built to exclusively deal with Finnish language. I started it to make a tool that better support me in learning Finnish, as well as learning how to do web development with React. Support for more languages will come if needed.

This project can be used live at [Finnish Language Tool](https://lwriter.netlify.com/).

Below you will find more information on what the tool is capable of.

## Table of Contents

- [Features](#features)
- [Limitations](#limitations)

## Features

LWriter is currently capable of the following features:

* `Automatic language detection`, with which you can input either Finnish or English, and the tool will settle the output for you. Unlike Google Translate, where input can be detected, but output language must be selected by manually.
* `Multiple translation windows`, which you can use to effectively reference and translate multiple words/phrases at the same time. Maximum windows supported is 4.
* `Resizable translation windows` allows you to interactively resize each translation window if needed to fit your demand (e.g. writing a long text on the first window, while using others for referencing)
* `Wiktionary lookup`, which helps looking up the double clicked word in either input or output area.
* `Heuristic lookup` handles cases where the word is not found as a Wiktionary article. The tool will perform a heuristic search to find all pages containing that word, and return the one that is closest to the word being looked up. This is useful in language like Finnish where conjugated word can look very different than the original. For e.g. performing search on `harjoitellut` can return a page with the original word `harjoitella`.
* `Filtered Wiktionary` refines the look up experience further by eliminating irrelevant languages from the source English Wiktionary.
* `Navigation within embedded Wiktionary` allows you to navigate interesting or relevant word within the look up window just by clicking on them, just like normal browsing.
* `Standalone Wiktionary Portal`, which is accessible through `/wiki/%ARTICLE%` page, this is done to help those needing the filtered output in third party application. In my case, I use it for GoldenDict desktop app to get a cleaner output everytime I look up a word. For e.g. going to `/wiki/book` will display a filtered Wiktionary page of `book` page.

## Limitations

Due to limitations in Google Translate API, this tool cannot achieve the following features as in Google Translate:

* Voice input
* Voice output
* Alternative phrase translations
* Alternative word translations with statistics

Please submit any [feedback or request](https://github.com/phuongfi91/lwriter/issues) to help the development of this project.

All contributions are welcome! :)
