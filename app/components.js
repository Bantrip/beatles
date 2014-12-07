define(function(require) {
    return [
            {
                type: 'Header'
            },
            {
                type: 'Body',
                children: [
                    //列表页
                    {
                        type: 'List.List',
                        path: '/list'
                    },
                    {
                        type: 'Edit',
                        path: '/edit'
                    }        
                ]
            }
        ];
  
})