(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {  
    const pid = JSON.parse(localStorage.getItem('project')).id
    const userid = Number(localStorage.getItem('userId'))

    mui('#group').on('tap', '.group-list', function () {
      categoryAdd(this.getAttribute('data-name'))
      // const isReapeat = $('#addItem li').filter((index, el) => {
      //   console.log(index)
      //   return this.attributes['data-name'].value === el.attributes['data-name'].value
      // })
      // if (isReapeat.length) return false
      // const temp = `<li class="border-grey" data-name="${this.attributes['data-name'].value}">
      //   <div class="flex flex-between align-center">
      //     <p class="ft-12 text-default ml-05 flex align-center del">
      //       <i class="icon iconfont ft-20 f-E23E3E mr-10">&#xe647;</i>
      //       <span>${this.attributes['data-name'].value}</span>
      //     </p>
      //     <span class="icon iconfont ft-20 text-default mr-10">&#xe665;</span>
      //   </div>
      // </li>`
      // this.style.background = '#fbfbfb'
      // $('#addItem').append(temp)
    })
    mui('body').on('tap', '#addLabel', function() {
      const val = $('#createLabel').val()
      if ($('#createLabel').val() === '') {
        mui.toast('Please enter content')
        return false
      }
      categoryAdd(val)
    })

    function categoryAdd (name) { 
      const params={
        createUserid: userid,
        name: name,
        projectId: pid,
        type: 4
      }
      $ajax('/projectcategory/save', 'post', params, (res) => {
        console.log('res', res)
        if (res.code === 1) {
          projectCategory()
          $('#createLabel').val('')
         }
       })
    }
    mui('body').on('tap', '#back', () => {
      mui.back()
    })

    initCategory()
    function initCategory () {
      $ajax('/category/list?type=3&pid=1', 'get', '', (res)=> {
        let temp = ''
        res.data.map((item) => {
          temp += `<li class="border-grey group-list" data-id="${item.id}" data-name="${item.name}" data-pid="${item.pid}" data-name="${item.name}">	 
            <i class="icon iconfont ft-20 f-6DB767 mr-10 pl-05 fl">&#xe648;</i>
            <p class="ft-12 text-default ml-05">${item.name}</p>
          </li>`
        })
        $('#group .category-list').append(temp)
      })    
    }
    projectCategory()
    function projectCategory () {
      $ajax(`/projectcategory/list?projectId=${pid}&type=4`, 'get', '', (res)=> {
        let temp = ''
        res.data.map((item) => {
          temp += `<li class="border-grey" data-id="${item.id}">
            <div class="flex flex-between align-center">
              <p class="ft-12 text-default ml-05 flex align-center del">
                <i class="icon iconfont ft-20 f-E23E3E mr-10">&#xe647;</i>
                <span>${item.name}</span>
              </p>
              <span class="icon iconfont ft-20 text-default mr-10">&#xe665;</span>
            </div>
          </li>`
        })
        $('#addItem').html(temp)
      })    
    }

    mui('#addItem').on('tap', '.del', function() {
      const id = this.parentNode.parentNode.getAttribute('data-id')
      delCategory(id)
    })
    function delCategory (id) { 
      $ajax(`/projectcategory/delete?id=${id}`, 'get', '', (res) => {
        if (res.code === 1) {
          projectCategory()
         }
      })
    }
  });
})(mui, document, jQuery);