<template>
<div class="modal" id="refine-export-modal" tabindex="-1">
<div class="modal-dialog modal-lg">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">Export refine plot</h5>

    <div class="row">
        <div class="col-9" id="preview">
            <preview-scatter v-if="showPlot" :ratio="ratio"></preview-scatter>
        </div>
        <div class="col-3 d-flex flex-column justify-content-between">
            <div>
                <span>Resolution</span>
                <div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" value="1" v-model="ratio">
                            1x1
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" value="2" v-model="ratio">
                            1x2
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" value=".5" v-model="ratio">
                            2x1
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <button
                    class="btn btn-link btn-sm"
                    @click.prevent="hide">Cancel
                </button>
            
                <button @click="export_" class="btn btn-primary pull-right submit-button btn-sm" :disabled="loading">
                    <span class="fa fa-refresh fa-spin" v-show="loading"></span>
                    Export
                </button>
            </div>
        </div>
    </div>

</div>
</div>
</div>
</div>
</template>

<script>
import Vue from 'vue'
import PreviewScatter from '../charts/PreviewScatter'

function getSVGString( svgNode ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var cssStyleText = getCSSStyles( svgNode );
	appendCSS( cssStyleText, svgNode );

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;

	function getCSSStyles( parentElement ) {
		var selectorTextArr = [];

		// Add Parent element Id and Classes to the list
		selectorTextArr.push( '#'+parentElement.id );
		for (var c = 0; c < parentElement.classList.length; c++)
				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
					selectorTextArr.push( '.'+parentElement.classList[c] );

		// Add Children element Ids and Classes to the list
		var nodes = parentElement.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
				selectorTextArr.push( '#'+id );

			var classes = nodes[i].classList;
			for (var c = 0; c < classes.length; c++)
				if ( !contains('.'+classes[c], selectorTextArr) )
					selectorTextArr.push( '.'+classes[c] );
		}

		// Extract CSS Rules
		var extractedCSSText = "";
		for (var i = 0; i < document.styleSheets.length; i++) {
			var s = document.styleSheets[i];
			
			try {
			    if(!s.cssRules) continue;
			} catch( e ) {
		    		if(e.name !== 'SecurityError') throw e; // for Firefox
		    		continue;
		    	}

			var cssRules = s.cssRules;
			for (var r = 0; r < cssRules.length; r++) {
				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
					extractedCSSText += cssRules[r].cssText;
			}
		}
		

		return extractedCSSText;

		function contains(str,arr) {
			return arr.indexOf( str ) === -1 ? false : true;
		}

	}

	function appendCSS( cssText, element ) {
		var styleElement = document.createElement("style");
		styleElement.setAttribute("type","text/css"); 
		styleElement.innerHTML = cssText;
		var refNode = element.hasChildNodes() ? element.children[0] : null;
		element.insertBefore( styleElement, refNode );
	}
}


function svgString2Image( svgString, width, height, format, callback ) {
	var format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	image.onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		});

		
	};

	image.src = imgsrc;
}

function save(blob, filesize) {
    var svgUrl = URL.createObjectURL(blob)
    var downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = 'refineplot.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

export default {
    data() {
        return {
            loading: false,
            ratio: 1,
            showPlot: false
        }
    },

    components: {
        PreviewScatter
    },

    methods: {
        hide() {
            this.showPlot = false
            $(this.$el).modal('hide')
        },
        export_() {
            var svgString = getSVGString(d3.select('#preview-scatter').node());
            var width = 500, height = 500;
            svgString2Image( svgString, 2*width, 2*height, 'png', save ); 
        },
        export_2() {
            var svgData = $('#preview-scatter')[0].outerHTML
            var svgBlob = new Blob([svgData], {type:'image/svg+xml;charset=utf-8'})
            var svgUrl = URL.createObjectURL(svgBlob)
            var downloadLink = document.createElement('a')
            downloadLink.href = svgUrl
            downloadLink.download = 'refineplot.svg'
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        }
    },

    watch: {
        ratio() {
            this.showPlot = false
            Vue.nextTick(() => this.showPlot = true)
        }
    },

    mounted() {
        $('#refine-export-modal').on('shown.bs.modal', () => {
            this.showPlot = true
        })
    }
}
</script>

<style scoped>
#preview {
    border: 1px solid grey;
    padding: 0;
}
</style>