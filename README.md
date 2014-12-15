#Description

A small abstraction which provides a more declarative way of defining gulp tasks.

#Concept

 A common pattern found in gulp files is to create separate build and watch
 tasks for each type of file being processed. This requires one to independently
 maintain each of these tasks and can be cumbersome as the number of tasks
 increases. Ultimately however the end goal is (usually) to apply the same set
 of transformations to specific file sets with minor variations in the pattern of
 execution.

 This module attempts to abstract the execution of file transformations away
 from the _description_ of those transformations. It does this by allowing one
 to define desired transformations as a series of rules and then facilitating
 the generation of certain types of tasks using said rules. A rule is simply a
 series of functions which generate vinyl transform streams (which is what most
 gulp modules expose).

 Goals:

 - Reduce the amount of boilerplate code (gulp.src, gulp.dest)
 - Provide a centralized location to define file transformations
 - Maintain the intuitive nature of pipeling typically employed in gulp tasks

#Usage

 - A ruleset is simply an array of objects each of which contains the following
   attributes:

  - `files:` A glob.src compatible glob expression which describes the files
    being transformed

  - `description:` An array of functions each of which generates a vinyl transform
    stream. These are used to process the files defined by the files attribute.

  - `opts:` An object which affects various properties of the transform process

    - `base:` The base used to derive relative paths of the files described by
      'files'

    - `dest:` The destination within the target folder (this will be prepended
      to the relative path)

    - `recompileAll:` A boolean value used by the watch generator which
      indicates whether or not all files matching the glob expression should
      be recompiled whenever one of them changes.
  
A ruleset can then be passed into the compile functions exposed by the module to
generate certain tasks. The compile functions has the following signature

lg.compile(rulset, dest, type, opts)

where
 
 - `ruleset` is the ruleset to be processed as described above
 - `dest` is the desired output location
 - `type` is the kind of task being generated (currently only watch and build are
   supported)
 - `opts` is identical to the option object described above but applies to all
    rules within the ruleset provided that those rules don't explicitly define
    those options (i.e it can be considered a default option set).

#Example

  - See [sample.js](sample.js)

#FAQS

  - *What sort of tomfoolery be this?*
    - I wish I had an answer for answer this :/

#Comments? Questions? Abuse?

  - Email r.vaiya@gmail.com
