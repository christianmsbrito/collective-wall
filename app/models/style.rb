class Style < ApplicationRecord
  belongs_to :styleable, polymorphic: true
end
